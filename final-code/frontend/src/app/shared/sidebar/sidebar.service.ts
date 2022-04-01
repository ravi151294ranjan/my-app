import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
// import { AppConfig } from 'app/shared/services/app_config';
import { AppConfig } from '../services/app_config';


@Injectable()
export class UserScenarioGroupService {
    domainName = AppConfig.IP_Address

    constructor(private http: HttpService) { }

/**
 * GetUserbasedGroups_limit method used to get the group data based on user based group id.
 * @param add_data Its contain the user based group data id and limit of the data.
 * @return Its return the group data with particular limit.
 */
    GetUserbasedGroups_limit(add_data) {
        return this.http.POSTMETHOD(this.domainName + 'grouping/getUserGroup_Limit/',add_data,
            AppConfig.header_info).then((res: any) => {
                return res;
            }, (err) => {
                return err;
            }).catch(err => {
                return err;
            });
    }


}
