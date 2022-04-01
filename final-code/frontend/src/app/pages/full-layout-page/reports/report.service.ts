import { Injectable } from '@angular/core';
// import { HttpService } from 'app/shared/services/http.service';
import { HttpService } from '../../../shared/services/http.service';
// import { AppConfig } from 'app/shared/services/app_config';
import { AppConfig } from '../../../shared/services/app_config';


@Injectable()
export class ReportService {
    domainName = AppConfig.IP_Address

    constructor(private http: HttpService) { }
    /**
     *  GetAllUser method to get list of user in user collection for to show the user list for report.
     */
    GetAllUser() {
        return this.http.GETMETHOD(this.domainName + 'users/getAllUser/', AppConfig.header_info).then((res: any) => {
            return res;
        }, (err) => {
            return err;
        }).catch(err => {
            return err;
        });
    }

    // getScenarioList() {
    //     return new Promise((resolve, reject) => {
    //         this.http.GETMETHOD(this.domainName + 'scenario/getAllScenario/', AppConfig.header_info.value).then((res: any) => {
    //             resolve(res)
    //         }, (err) => {
    //         }).catch(err => {
    //             reject(err)
    //         })
    //     })
    // }

    /**
     * getScenarioList service get all scenario data based on tennat.
     * @param add_data Its contain scenario data based on the user selected.
     * @return It contian the scenario list based on user. 
     */
    getScenarioList(add_data: any) {
        return this.http.POSTMETHOD(this.domainName + 'report/getUserBasedScenarioList',
            add_data, AppConfig.header_info).then((res: any) => {
                return res;
            }, (err) => {
                return err;
            }).catch(err => {
                return err;
            });
    }

    /**
      * getScenarioReport service get report based on selected scenario.
      * @param add_data Its contain scenario data based on the user and scenario selected.
      * @return It contian the report data based on scenario. 
      */
    getScenarioReport(add_data: any) {
        return this.http.POSTMETHOD(this.domainName + 'report/getSenarioBasedReport',
            add_data, AppConfig.header_info).then((res: any) => {
                return res;
            }, (err) => {
                return err;
            }).catch(err => {
                return err;
            });
    }

    /**
     * Socket example testing. Only for socke testing metod in angular not used in Prjt.
     * @param todo 
     * @param socket 
     */
    createTodo(todo: any, socket: any): void {
        socket.emit('addWebGlReportData_server', todo);
    }


    // GetAllGroups() {
    //     return this.http.GETMETHOD(this.domainName + 'grouping/getAllGroup/',
    //         AppConfig.header_info.value).then((res: any) => {
    //             return res;
    //         }, (err) => {
    //             return err;
    //         }).catch(err => {
    //             return err;
    //         });
    // }

    // getGroupForEdit(id) {
    //     return this.http.GETMETHOD(this.domainName + 'grouping/getGroupForEdit/' + id,
    //         AppConfig.header_info.value).then((res: any) => {
    //             return res;
    //         }, (err) => {
    //             return err;
    //         }).catch(err => {
    //             return err;
    //         });
    // }

    // updategroup(groupData: any, idval: any) {
    //     const id = idval
    //     return this.http.PUTMETHOD(this.domainName + 'grouping/updateGroup/' + id,
    //         groupData, AppConfig.header_info.value).then((res: any) => {
    //             return res;
    //         }, (err) => {
    //             return err;
    //         }).catch(err => {
    //             return err;
    //         });
    // }


    // DeleteSingleUser(id: any) {
    //     return this.http.DELETEMETHOD(this.domainName + 'grouping/deleteGroup/' + id,
    //         AppConfig.header_info.value).then((res: any) => {
    //             return res;
    //         }, (err) => {
    //             return err;
    //         }).catch(err => {
    //             return err;
    //         });
    // }

}
