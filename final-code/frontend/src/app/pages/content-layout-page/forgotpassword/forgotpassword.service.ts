import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';
import { AppConfig } from 'app/shared/services/app_config';
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  domainName = AppConfig.IP_Address

  constructor(private http: HttpService) { }

  /**
 * postMethod service to send credentials details in backend to check the access of Application.<br>
 * Api path/name => tenant/updateTenantDetails_data/  
 * method => Put
 * @param add_data {Objetc} credentials details
 * @return success or failure details with tenant data.
 */
  postMethod(params) {
    const header = {
      key: 'Content-Type', value: 'application/json',
      // tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    };
    return this.http.POSTMETHOD(this.domainName + 'forgotPwd/forgotPassword/', params, header).then((res: any) => {

      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }

  validateId(params) {
    const header = {
      key: 'Content-Type', value: 'application/json',
      // tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    };
    return this.http.POSTMETHOD(this.domainName + 'forgotPwd/validateId/', params, header).then((res: any) => {

      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }

  updatePassword(params) {
    const header = {
      key: 'Content-Type', value: 'application/json',
      // tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    };
    return this.http.POSTMETHOD(this.domainName + 'forgotPwd/updatePassword/', params, header).then((res: any) => {

      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }

  ProfilePasswordUpdate(params) {
    const header = {
      key: 'Content-Type', value: 'application/json',
      // tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    };
    return this.http.POSTMETHOD(this.domainName + 'forgotPwd/ProfilePasswordUpdate/', params, header).then((res: any) => {

      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }


  changePasswordFirstLogin(params) {
    const header = {
      key: 'Content-Type', value: 'application/json',
      // tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    };
    return this.http.POSTMETHOD(this.domainName + 'forgotPwd/changePasswordFirstLogin/', params, header).then((res: any) => {

      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }

}
