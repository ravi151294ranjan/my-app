import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from './report.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as io from 'socket.io-client'
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {environment} from './../../../../environments/environment'

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    providers: [ReportService]
})
export class ReportsComponent implements OnInit {
    private url = environment.apiURL;
    private socket;

    
    options: any;
    BarData: any;
    GaugeData: any;
    data = [];
    timeTakenAll = 0;
    totalAttempt = 0
    warnings = 0
    userData = [];
    scenarioList = [];
    selectedGroupData: any;
    userSelectvalue: any;
    userInfo: any;
    selectedUserID: any;
    reportData: any;
    public rptDrGroup: FormGroup;
    public isShow: boolean;
    noReportsShow = true

    scenarioName: any;
    userName: any;

    fileUrl
    selectedUser
    selectedScenario
    res = {
        "_id": "",
        "scenarioName": "",
        "scenarioId": "",
        "userName": "",
        "timeAllocatedValue": 0,
        "timeTakenValue": 0,
        "totalAttemptsCount": 0,
        "beginnerRange": {
            "min": 0,
            "max": 0
        },
        "intermediateRange": {
            "min": 0,
            "max": 0
        },
        "expertRange": {
            "min": 0,
            "max": 0
        },
        "isSkillMeterTransition": true,
        "isBarTransition:": true,
        "configCount": 0,
        "isAttemptsPanelTransition": true,
        "AttemptsData": [{
            "step": "",
            "timeTaken": 0,
            "attemptsCount": 0,
            "extraSteps": 0
        }]
    }
    userdataFilter = []
    /**
     * On constructor to get all user list and scenario based on role. <br>
     * if role is admin its call all user list<br>
     * if role is user to call all scenario list.
     */
    constructor(private reportService: ReportService, private location: Location, private router: Router, private sanitizer: DomSanitizer) {
        // this.location.replaceState('/pages/report?tendetail=' + JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail);
        this.userInfo = JSON.parse(localStorage.UserInfo).userdetails
        this.rptDrGroup = new FormGroup({
            user: new FormControl('', Validators.required),
            scenario: new FormControl('', Validators.required)
        });
        if (this.userInfo.role === '1') {
            this.LoadUserDrop();
        }
        else {
            this.selectedUserID=this.userInfo._id
            this.LoadScenarioList(this.userInfo.SelectedGroup);
        }
    }

    ngOnInit() {
        if (localStorage.loginInfonetApp === undefined || localStorage.UserInfo === undefined) {
            this.router.navigate(['./login']);
        }


        /**
         * socket io example. Not used in Prjt.
         */
        // // // // // socket io connection
        // var token = JSON.parse(localStorage.loginInfonetApp).token;
        // this.socket = io.connect('http://localhost:3000', {
        //     query: { token: token,tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail }
        // })
        // this.socket.on('addWebGlReportData', (data) => {
        //     // const blob = new Blob([data.buffer], { type: 'application/octet-stream' });
        //     const blob = new Blob([data], { type: 'application/octet-stream' });
        //     // const url= window.URL.createObjectURL(blob);
        //     // window.open(url)
        //     this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        // });
        // this.socket.on('error', function (err) {
        // })
    }
    /**
     * socket io example. Not used in Prjt.
     */
    // socket io connection
    // AddTodo(): void {
    //     let data={
    //         data:JSON.parse(localStorage.assetData).assetData
    //     }
    //     this.reportService.createTodo(data, this.socket);
    // }


    /**
     * LoadUserDrop method to load all user list<br>
     * Based on that data to get user role to push data inuserdata array.
     */
    LoadUserDrop() {
        this.reportService.GetAllUser().then((result) => {
            this.userdataFilter = result.data;
            let userArray = []
            for (let a = 0; a < this.userdataFilter.length; a++) {
                if (this.userdataFilter[a].role !== "1") {
                    this.userdataFilter[a]['name'] = `${this.userdataFilter[a].firstname} ${this.userdataFilter[a].lastname}`
                    userArray.push(this.userdataFilter[a])
                    this.userData = userArray//.push(this.userdataFilter[a])
                }
            }
        }).catch((error) => {
        });
    }
    /**
     * selectChangeHandler method to load scenario list based on user selection
     * @param event Its conatin the selected user value
     */
    selectChangeHandler(event: any) {
        this.scenarioList = []
        this.selectedScenario = null
        this.noReportsShow = true
        this.isShow = false;    // added for chart hide
        if (event != undefined) {
            this.selectedUserID = event._id;
            for (let i = 0; i < this.userData.length; i++) {
                if (event._id === this.userData[i]._id) {
                    this.selectedGroupData = this.userData[i].SelectedGroup;
                    this.LoadScenarioList(this.selectedGroupData)
                }
            }
        }
    }
    /**
     * changeScenarioDrop method to load report based on scenario selection.<br>
     * Based on scenarioi selection to load call Pie chart, Bar chart and Gauge chart.
     * @param event Its conatin the selected scenario value
     */
    noScenarioMsg
    timeAllocatedValue_detailed
    timeTakenValue_detailed
    reportTableData=[]
    changeScenarioDrop(event: any) {
        this.noReportsShow = true
        this.isShow=false
        if (event != undefined) {
            this.reportData = {
                userid: this.selectedUserID,
                scenarioId: event._id
            }
            this.reportService.getScenarioReport(this.reportData).then((result) => {
                this.data = [];
                this.timeTakenAll = 0;
                this.totalAttempt = 0
                this.warnings = 0
                if (result.success) {
                    this.res = result.data[0];
                    this.scenarioName = this.res.scenarioName;
                    this.userName = this.res.userName;
                    for (let i = 0; i < this.res.AttemptsData.length; i++) {
                        var newEntry = { "name": this.res.AttemptsData[i].step, "y": this.res.AttemptsData[i].timeTaken };
                        this.data.push(newEntry);

                        this.reportTableData.push({step:this.res.AttemptsData[i].step,
                            timeTaken:this.secondsToHms(this.res.AttemptsData[i].timeTaken),
                            attemptsCount:this.res.AttemptsData[i].attemptsCount
                        })
                        this.timeTakenAll = this.timeTakenAll + this.res.AttemptsData[i].timeTaken;
                        this.totalAttempt = this.totalAttempt + this.res.AttemptsData[i].attemptsCount;
                        this.warnings = this.warnings + this.res.AttemptsData[i].extraSteps;
                    }
                    this.timeAllocatedValue_detailed=this.secondsToHms(this.res.timeAllocatedValue)
                    this.timeTakenValue_detailed=this.secondsToHms(this.res.timeTakenValue)
                    this.LoadpieChartData();
                    this.LoadBarChartData();
                    this.LoadGaugeChartData();
                    this.isShow = true;
                }
                else {
                    this.isShow = false;
                    this.noScenarioMsg = 'No reports found'
                    this.noReportsShow = false
                }

            });
        }
    }

    fmtMSS(s){return(s-(s%=60))/60+(9<s?'min:':'min:0')+s+'sec'}

    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        let hrdata;
        let mindata;
        let secdata;
        if(h==0){
            hrdata='00h:'
        }else{
            if( h>9){
                hrdata=h+'h:'
            }else{
                hrdata='0'+h+'h:'
            }
        }
        if(m==0){
            mindata='00m:'
        }else{
            if( m>9){
                mindata=m+'m:'
            }else{
                mindata='0'+m+'m:'
            }
        }
        if(s==0){
            secdata='00s'
        }else{
            if( s>9){
                secdata=s+'s'
            }else{
                secdata='0'+s+'s'
            }
        }
        // var hDisplay = h > 0 ? h + (h == 1 ? " hr: " : " hrs: ") : "00 hr: ";
        // var mDisplay = m > 0 ? m + (m == 1 ? " min: " : " mins: ") : "00 min: ";
        // var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "00 sec";
        return hrdata + mindata + secdata; 
    }





    /**
     * LoadScenarioList method used to load scenario list
     * @param selectedGroupData Its contain scenario deta based on user.
     */
    LoadScenarioList(selectedGroupData: any) {
        this.scenarioList = []
        let scenarioPublished=[]

        this.rptDrGroup.controls['scenario'].setValue('');
        this.reportService.getScenarioList(selectedGroupData).then((result) => {
            if (result.message !== "Scenario not found.") {

                for(let a=0;a<result.length;a++){
                   if(result[a].publishFlag == 1){
                       if(result[a].scenarioDelete!= undefined && result[a].scenarioDelete ==1){
                        let sTitle=result[a]
                        sTitle.Title=result[a].Title +'(deleted)'
                        scenarioPublished.push(sTitle)
                       }else{
                        scenarioPublished.push(result[a])
                       }
                   }
                }
                this.scenarioList = scenarioPublished;
                // this.scenarioList = result;
            }
        }).catch((error) => {
        });
    }
    /**
     * LoadpieChartData method used to load the pie chart based on scenario selection.
     */
    LoadpieChartData() {
        this.options =
        {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Time Taken: ' + this.timeTakenValue_detailed
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{series.name}</b> {point.percentage:.1f} %',
                        connectorColor: 'silver'
                    }
                    // showInLegend: true
                }
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: this.data
            }]
        }
        Highcharts.chart('container', this.options);
    }

    /**
     * LoadBarChartData method used to load the Bar chart based on scenario selection.
     */
    LoadBarChartData() {
        this.BarData = {
            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'category'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    // borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        // format: '{point.y:.1f}m'this.timeAllocatedValue_detailed
                        format: '{point.detailed}'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.detailed}<br/>'
            },

            series: [
                {
                    name: "",
                    colorByPoint: true,
                    data: [
                        {
                            name: "Time Allocated",
                            y: this.res.timeAllocatedValue,
                            color: '#e2ba27',
                            detailed:this.timeAllocatedValue_detailed
                        },
                        {
                            name: "Time Taken",
                            y: this.res.timeTakenValue,
                            color:'#56b31d',
                            detailed:this.timeTakenValue_detailed
                        }
                    ]
                }
            ],
        }

        Highcharts.chart('Barcontainer', this.BarData);
    }

    /**
     * LoadGaugeChartData method used to load the Gauge chart based on scenario selection.
     */
    LoadGaugeChartData() {

        this.GaugeData = {
            chart: {
                type: 'gauge',
                //     plotBorderWidth: 1,
                plotBackgroundColor: {
                    // linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF4C6'],
                        [0.3, '#FFFFFF'],
                        [1, '#FFF4C6']
                    ]
                },
                plotBackgroundImage: null,
                height: 200
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Skill Level'
            },

            pane: [{
                startAngle: -45,
                endAngle: 45,
                background: null,
                center: ['50%', '145%'],
                size: 300
            }],

            exporting: {
                enabled: false
            },

            tooltip: {
                enabled: false
            },
            yAxis: [{
                min: 0,
                max: this.res.beginnerRange.min + 5,
                minorTickPosition: 'outside',
                tickPosition: 'outside',
                reversed:true,
                plotBands: [{
                    from: this.res.expertRange.min,
                    to: (this.res.intermediateRange.min)-1,
                    color: '#54B301',
                    innerRadius: '100%',
                    outerRadius: '105%'
                },
                {
                    from: (this.res.intermediateRange.min)-1,
                    to: (this.res.intermediateRange.max)+1,
                    color: '#e3bb0b',
                    innerRadius: '100%',
                    outerRadius: '105%'
                },
                {
                    from: (this.res.intermediateRange.max)+1,
                    to: this.res.beginnerRange.min + 5,
                    color: '#c72b2c',
                    innerRadius: '100%',
                    outerRadius: '105%'
                }
                ],
                title: {
                    text: '<span style="font-size:15px">* No Of Attempts</span>',
                    y: -10
                }
            }],

            plotOptions: {
                gauge: {
                    dataLabels: {
                        enabled: false
                    },
                    dial: {
                        radius: '100%'
                    }
                }
            },

            series: [{
                name: 'Channel A',
                data: [this.res.totalAttemptsCount],
                yAxis: 0
            }]

        }
        Highcharts.chart('Gaugecontainer', this.GaugeData);
    }

}
