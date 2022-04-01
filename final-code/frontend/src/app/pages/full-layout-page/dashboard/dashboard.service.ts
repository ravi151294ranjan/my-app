import { Injectable } from '@angular/core';
// import { HttpService } from 'app/shared/services/http.service';
import { HttpService } from '../../../shared/services/http.service';
// import { AppConfig } from 'app/shared/services/app_config';
import { AppConfig } from '../../../shared/services/app_config';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {

    domainName = AppConfig.IP_Address

    constructor(private http: HttpService) { }

    /**
     * CreateShortnerURL service create short url based on scenario data. <br>
     * Api path/name => urlShortner/shorten/   <br>
     * method => post <br>
     * @param add_data Its contain scenario data for short url creation.
     * @return Its return the generated short url.
     */
    CreateShortnerURL(add_data: any) {
        return this.http.POSTMETHOD(this.domainName + 'urlShortner/shorten/',
            add_data, AppConfig.header_info).then((res: any) => {
                return res;
            }, (err) => {
                return err;
            }).catch(err => {
                return err;
            });
    }
    /**
     * Subscribe notification
     * Api path/name=> subscribenotification/pushnotification <br>
     * method => post <br>
     * @param add_data its contain notification data
     * @return Its return success or failure of subscription
     */

    subscribeNotification(add_data: any) {
        return this.http.POSTMETHOD_SuperAdmin(this.domainName + 'users/pushnotification/',
            add_data, AppConfig.header_info_SuperAdmin).then((res: any) => {
                return res;
            }, (err) => {
                return err;
            }).catch(err => {
                return err;
            });
    }

    /**
     * get all count of scenarios
     * Api path/name=> subscribenotification/pushnotification <br>
     * method => post <br>
     * @return Its return success or failure with data
     */
    getScenarioCounts() {
        return this.http.GETMETHOD(this.domainName + 'dashboard/getScenarioGroupingCounts/',
             AppConfig.header_info).then((res: any) => {
                return res;
            }, (err) => {
                return err;
            }).catch(err => {
                return err;
            });
    }


    getDeletedScenarioCount(){
        return this.http.GETMETHOD(this.domainName + 'grouping/getDeletedScenarioCount/',
        AppConfig.header_info).then((res: any) => {
            return res;
        }, (err) => {
            return err;
        }).catch(err => {
            return err;
        });
    }





}
