import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';
import { AppConfig } from 'app/shared/services/app_config';
@Injectable({
  providedIn: 'root'
})
export class VerifyRegisterService {
  domainName = AppConfig.IP_Address

  constructor(private http: HttpService) { }

  verifyEmail(params){
    const header = {
      key: 'Content-Type', value: 'application/json',
      tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    };
    return this.http.POSTMETHOD(this.domainName + 'register/verifyEmailRegister/', params, header).then((res: any) => {
      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }

}
