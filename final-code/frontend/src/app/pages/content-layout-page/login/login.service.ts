import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';
import { AppConfig } from 'app/shared/services/app_config';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  domainName = AppConfig.IP_Address

  constructor(private http: HttpService) { }

  /**
 * postMethod service to send credentials details in backend to check the access of Application.<br>
 * Api path/name => tenant/updateTenantDetails_data/  
 * method => Put
 * @param add_data {Objetc} credentials details
 * @return success or failure details with tenant data.
 */
  postMethod(params, usertype) {
    var header: { key: string; value: string; tendetail?: any; }
    var paramsValue: { [x: string]: boolean; }
    if (Object.keys(usertype).length > 0) {
      header = {
        key: 'Content-Type', value: 'application/json',
        tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
      };
      paramsValue = params
      paramsValue['superAdmin'] = false

    } else {
      header = {
        key: 'Content-Type', value: 'application/json'
      };
      paramsValue = params
      paramsValue['superAdmin'] = true
    }
    console.log(params)
    return this.http.POSTMETHOD(this.domainName + 'tokenGen/login/', params, header).then((res: any) => {
      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }
}
