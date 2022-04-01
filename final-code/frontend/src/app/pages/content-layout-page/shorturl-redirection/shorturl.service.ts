import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';
import { AppConfig } from 'app/shared/services/app_config';
@Injectable({
  providedIn: 'root'
})
export class shortUrlService {
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
    var header: { key: string; value: string; tendetail?: any; }
    // var paramsValue: { [x: string]: boolean; }
    // if (Object.keys(usertype).length > 0) {
    //   header = {
    //     key: 'Content-Type', value: 'application/json',
    //     tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
    //   };

    // } 

    // else {
    header = {
      key: 'Content-Type', value: 'application/json'
    };
    // }
    return this.http.POSTMETHOD(this.domainName + 'tokenGen/shortUrl/', params, header).then((res: any) => {
      return res;
    }, (err) => {
    }).catch(err => { console.log(err); });
  }

  shortUrlValid(add_data) {
    return this.http.POSTMETHOD(this.domainName + 'urlShortner/shorten/',
      add_data, AppConfig.header_info).then((res: any) => {
        return res;
      }, (err) => {
        return err;
      }).catch(err => {
        return err;
      });
  }

  scenarioRedirect(add_data) {
    return new Promise((resolve, reject) => {
      const header = AppConfig.header_info;
      this.http.POSTMETHOD(this.domainName + 'urlShortner/scenarioredirect', add_data,
        header).then((res: any) => {
          resolve(res);
        }, (err) => {
          reject(err)
        }).catch(err => { reject(err); console.log(err); });
    })
  }


}
