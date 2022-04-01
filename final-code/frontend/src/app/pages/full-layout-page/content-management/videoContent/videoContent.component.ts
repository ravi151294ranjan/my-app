import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  DoCheck,
  Renderer2,
} from '@angular/core';
// import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { AdminService } from '../../admin-services/admin-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ckEditorConfig } from '../../../../shared/config/ckeditor';


declare var require: any;

const data: any = require('../../../../shared/data/chartist.json'); //../../shared/data/chartist.json

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-admin-video-content',
  templateUrl: './videoContent.component.html',
  styleUrls: ['./videoContent.component.scss','../../content-management/content-management.component.scss'],
})
// AfterViewInit
export class AdminVideoContentComponent implements OnInit, DoCheck {
  @ViewChild('imhere') imhere: ElementRef;
  videoEl: HTMLVideoElement;
  addChapterBtn: HTMLElement;
  addChapterForm: FormGroup;
  addContentForm: FormGroup;
  formSubmitted: boolean;
  contentSubmitted: boolean;
  imageURL: string;
  chapters: Array<object>;
  showCreateChapterForm: boolean;
  videoContentSrc: string;
  contentFormData: object;
  ckEditorConfig: object;
  glossary: string;
  frameIsReady: boolean;
  videoDataURI: string;
  pointerEvents: string;
  isEdit:boolean;

  /**
   * On constructor to get encrypted tenant data in URL to store local sorage.
   */
  constructor(
    private location: Location,
    private modalService: NgbModal,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    if (
      localStorage.loginInfonetApp === undefined ||
      localStorage.UserInfo === undefined
    ) {
      this.router.navigate(['./login']);
    }

    this.chapters = [];
    this.formSubmitted = false;
    this.contentSubmitted = false;
    this.showCreateChapterForm = false;
    this.videoContentSrc = '';
    this.contentFormData = {};
    this.ckEditorConfig = ckEditorConfig.baseConfig;
    this.glossary = '';
    this.frameIsReady = false;
    this.videoDataURI = '';
    this.pointerEvents = 'pointer-events:all;';

    this.addContentForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      contentVideo: [''],
      language: ['English', Validators.required],
      uploadedVideoContent: ['', Validators.required]
    });

    this.addChapterForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      actualTime: ['', Validators.required],
      timestamp: [{ value: '' }, Validators.required],
      posterImage: []
    });
  }

  /**
   * On ngOnInit method to remove predefined data in local storage.
   */
  ngOnInit() {
    // this.GetcountOfuser()

        /**EDIT STARTS */
        if (this.activatedRoute.snapshot.params.id) {
          this.isEdit=true;
          let editDataObj = {};
          editDataObj['type'] = "Video";
          editDataObj['id'] = this.activatedRoute.snapshot.params.id;
          this.adminService.getContentById(editDataObj).subscribe(response => {
            if(Object.keys(response['data']).length ) {
              console.log("response['data']", response['data'])
              this.addContentForm.get('title').setValue(response['data']['title'])
              this.addContentForm.get('description').setValue(response['data']['description'])
              this.addContentForm.get('language').setValue(response['data']['language'])
              this.addContentForm.controls.uploadedVideoContent.setValue(response['data']['path'].substring(response['data']['path'].indexOf('_') + 1));   
              this.videoContentSrc = response['data']['path'];
            }
          }, error => {
            console.log(error)
            this.toastr.error('Invalid Content', 'Invalid Content');
          });
     
        }
        /**EDIT ENDS */
  }

  ngDoCheck() {
    if(this.videoEl == undefined){
      this.videoEl = <HTMLVideoElement>document.getElementsByTagName('video')[0];
    }
  }

  /**
   * Getcountofuser
   */
  toalusercount = 0;
  totaluserlimit = 0;
  totalScenario = 0;
  totalGroup = 0;
  GetcountOfuser() {
    this.adminService.getcountOfuser().then((result) => {
      if (result.success) {
        this.toalusercount = result.totalUser; //- 1
        this.totaluserlimit = result.userlimit;
        // this.getScenarioCounts()
        // this.getDeletedScenarioCount()
      }
    });
  }

  open(content: any) {
    this.videoEl.pause();
    this.frameIsReady = false;
    let isValidInterval = this.checkInterval();
    if(!isValidInterval){
    //   let result = this.chapters.filter(obj => {
    //     return obj['time'] === 0
    //   })

    //  if(result.length){
    //   return false;
    //  }

      this.toastr.error('Chapter Interval should be atleast 10 seconds', '');
      return false;
    }

    let timerId = setInterval(() => {
      if(this.videoEl.readyState == 4) {
        clearInterval(timerId);
        let canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
        this.videoDataURI = canvas.toDataURL('image/jpeg');
        this.frameIsReady = true;
      } 
    }, 1000);

    this.imageURL = '';
    this.formSubmitted = false;
    this.addChapterForm.reset();
    // Time Formatting
    let time = Math.round(this.videoEl.currentTime);
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    let finalTime =
      this.str_pad_left(minutes, '0', 2) +
      ':' +
      this.str_pad_left(seconds, '0', 2);
    this.addChapterForm.controls.timestamp.setValue(finalTime);
    this.addChapterForm.controls.actualTime.setValue(time);
    this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
  }

  get addChapterFormData(): any {
    return this.addChapterForm.controls;
  }

  get addContentFormData(): any {
    return this.addContentForm.controls;
  }

  uploadVideoFile(event){
    if(event.target.files.length > 0) 
    {
      let file = event.target.files[0];
      if(file.type != 'video/mp4'){
        this.toastr.error('Only mp4 files are allowed', '');
        return;
      }
      this.pointerEvents = 'pointer-events:none;';
      this.adminService.uploadFile(file).subscribe(response => {
        
        this.videoContentSrc = response['data'];
        localStorage.setItem("draftVideoId",response['draftVideoId']);
        this.addContentForm.controls.uploadedVideoContent.setValue(response['data'].substring(response['data'].indexOf('_') + 1));
        this.pointerEvents = 'pointer-events:all;';
        this.toastr.success('Video uploaded successfully', '');
      }, error => {
        this.toastr.error(error.error.error, '');
      });
    }
  }

  checkInterval() : boolean{
    const currentTime = Math.round(this.videoEl.currentTime);
    const existingTimestamps = this.chapters.map((actuals) => actuals['time']);
    if (existingTimestamps.length) {
      existingTimestamps.sort((a, b) => {
        return Math.abs(currentTime - a) - Math.abs(currentTime - b);
      });
      const diff = (a, b) => {
        return a > b ? a - b : b - a;
      };
      let total = diff(currentTime, existingTimestamps[0]);
      if (total < 11) {
        return false;
      }else{
        return true;
      }
    }
    return true;
  }

  createNewChapter(): void {

    let isValidInterval = this.checkInterval();
    if(!isValidInterval){
      this.toastr.error('Chapter Interval should be atleast 10 seconds', '');
      return;
    }

    this.formSubmitted = true;
    if (this.addChapterForm.invalid) {
      return;
    }
    const obj = this.addChapterForm.value;

    const imageContainer = this.renderer.createElement('div');
    const dynamicImg = this.renderer.createElement('img');
    let dataURI = '';

    if (this.imageURL && this.imageURL !== '') {
      dataURI = this.imageURL;
      this.renderer.setProperty(dynamicImg, 'src', dataURI);
      this.renderer.setProperty(
        dynamicImg,
        'style',
        'width: 104px;height: 104px;'
      );
    } else {
      let canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
      dataURI = canvas.toDataURL('image/jpeg');
      this.renderer.setProperty(dynamicImg, 'src', dataURI);
    }
    const firstContainer = this.renderer.createElement('div');
    this.renderer.setProperty(
      firstContainer,
      'style',
      'margin-bottom:1px;display: flex;flex-wrap: wrap;margin-right: 4px;margin-left: -15px;border-top: 2px solid #ccc;border-bottom: 2px solid #ccc;border-right: 2px solid #ccc;border-left: 1px solid #ccc;'
    );

    this.renderer.setProperty(
      imageContainer,
      'style',
      'flex: 0 0 100%;max-width: 30%;'
    );
    this.renderer.appendChild(imageContainer, dynamicImg);

    const contentContainer = this.renderer.createElement('div');
    this.renderer.setProperty(
      contentContainer,
      'style',
      'padding:10px;flex: 0 0 100%;max-width: 68%'
    );

    const titleLabel = this.renderer.createElement('label');
    this.renderer.setProperty(titleLabel, 'innerHTML', obj.title);
    this.renderer.setProperty(
      titleLabel,
      'style',
      'display:block;font-weight:bold'
    );
    const descriptionLabel = this.renderer.createElement('label');
    this.renderer.setProperty(descriptionLabel, 'innerHTML', obj.description);

    this.renderer.appendChild(contentContainer, titleLabel);
    this.renderer.appendChild(contentContainer, descriptionLabel);

    this.renderer.appendChild(firstContainer, imageContainer);
    this.renderer.appendChild(firstContainer, contentContainer);
    this.renderer.appendChild(this.imhere.nativeElement, firstContainer);

    this.chapters.push({
      title: obj.title,
      description: obj.description,
      poster: dataURI,
      timestamp: obj.timestamp,
      time: obj.actualTime,
    });

    this.chapters.sort(this.sortArrayOfObjects);
    this.toastr.success('Chapter "'+obj.title+'" added successfully')
    this.modalService.dismissAll('modalData')
  }

  createNewContent(): void {
    this.contentSubmitted = true;
    if (this.addContentForm.invalid) {
      return;
    }

    this.contentFormData = this.addContentForm.value;
    this.showCreateChapterForm = true;
    this.addChapterBtn = document.getElementById('addChapterBtn');
    let timerId = setInterval(() => {
      if(this.addChapterBtn == undefined || this.addChapterBtn == null){
        this.addChapterBtn = document.getElementById('addChapterBtn')
      }else{
        clearInterval(timerId);
        let el: HTMLElement = this.addChapterBtn;
        el.click();
      }
    }, 200);
  }

  finalData(): void {

    if(document.getElementById('glossary')['value'] == ''){
      this.toastr.error('Add Glossary before uploading the content', '');
      return;
    }

    let finalData = Object.assign({}, this.contentFormData);
    finalData['draftId'] = localStorage.getItem("draftVideoId");
    finalData['path'] = this.videoContentSrc;
    finalData['chapters'] = this.chapters;
    finalData['glossary'] = document.getElementById('glossary')['value']
    delete finalData['uploadedVideoContent'];
    delete finalData['contentVideo'];

    this.adminService.uploadContent(finalData).subscribe((response) => {
      this.toastr.success('Video uploaded successfully', '');
      this.router.navigate(['/content']);
    }, error => {
      this.toastr.error(error.error.error, '');
    });
  }

  sortArrayOfObjects(a, b) {
    if (a.time < b.time) {
      return -1;
      // a should come after b in the sorted order
    } else if (a.time > b.time) {
      return 1;
      // and and b are the same
    } else {
      return 0;
    }
  }

  str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addChapterForm.get('posterImage').updateValueAndValidity();
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Donut chart configuration Starts
  DonutChart1: Chart = {
    type: 'Pie',
    data: data['DashboardDonut'],
    options: {
      donut: true,
      donutWidth: 3,
      startAngle: 0,
      chartPadding: 25,
      labelInterpolationFnc: function (value) {
        return '\ue9c9';
      },
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy:
                (data.element.root().height() + data.element.height() / 4) / 2,
              class: 'ct-label',
              'font-family': 'feather',
            });
          } else {
            data.element.remove();
          }
        }
      },
    },
  };
  // Donut chart configuration Ends

  // Donut chart configuration Starts
  DonutChart2: Chart = {
    type: 'Pie',
    data: data['DashboardDonut'],
    options: {
      donut: true,
      donutWidth: 3,
      startAngle: 90,
      chartPadding: 25,
      labelInterpolationFnc: function (value) {
        return '\ue9e7';
      },
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy:
                (data.element.root().height() + data.element.height() / 4) / 2,
              class: 'ct-label',
              'font-family': 'feather',
            });
          } else {
            data.element.remove();
          }
        }
      },
    },
  };
  // Donut chart configuration Ends

  // Donut chart configuration Starts
  DonutChart3: Chart = {
    type: 'Pie',
    data: data['DashboardDonut'],
    options: {
      donut: true,
      donutWidth: 3,
      startAngle: 270,
      chartPadding: 25,
      labelInterpolationFnc: function (value) {
        return '\ue964';
      },
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy:
                (data.element.root().height() + data.element.height() / 4) / 2,
              class: 'ct-label',
              'font-family': 'feather',
            });
          } else {
            data.element.remove();
          }
        }
      },
    },
  };
  // Donut chart configuration Ends
}
