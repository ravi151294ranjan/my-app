import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';
import { AppConfig } from 'app/shared/services/app_config';

@Injectable({
    providedIn: 'root'
})

export class ScenarioTestService {
    domainName = AppConfig.IP_Address

    constructor(private http: HttpService) { }
    /**
     * verifyUser service to send user details in backend to check wether the user have access for the scenario or not.<br>
     * Api path/name => users/VerifyTokenDetails/  
     * method => Post
     * @param Userdetails {Objetc} User details
     * @return success or failure details with User data.
     */
    verifyUser(Userdetails) {
        return new Promise((resolve, reject) => {
            let header;
            const scenarioUserDetails = {
                tokenval: localStorage.loginInfonetApp,
                id: Userdetails.id
            }
            if (!localStorage.loginInfonetApp) {
                header = {
                    key: 'Content-Type', value: 'application/json',
                    tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
                };
                return this.http.POSTMETHODNoToken(this.domainName + 'scenarioUserVerify/VerifyScenarioUser/',
                    scenarioUserDetails, header).then((res: any) => {
                        resolve(res);
                    }, (err) => {
                        reject(err)

                    }).catch(err => { reject(err); console.log(err); });
            } else {
                header = AppConfig.header_info
            }
            this.http.GETMETHOD(this.domainName + 'users/VerifyTokenDetails/' + Userdetails.id,
                header).then((res: any) => {
                    resolve(res);
                }, (err) => {
                    reject(err)
                }).catch(err => { reject(err); console.log(err); });
        })
    }
    /**
     * verifyToken service to check the token validity.<br>
     * Api path/name => users/VerifyTokenDetails/  
     * method => Post
     * @param Userdetails {Objetc} User details
     * @return success or failure details.
     */
    verifyToken(tokenDetaisl) {
        return new Promise((resolve, reject) => {
            const header = AppConfig.header_info;
            this.http.POSTMETHOD(this.domainName + 'users/VerifyTokenDetails/', tokenDetaisl,
                header).then((res: any) => {
                    resolve(res);
                }, (err) => {
                    reject(err)
                }).catch(err => { reject(err); console.log(err); });

        })

    }

    verifyDeletedScenario(ScenarioDetails){
        return new Promise((resolve, reject) => {
            const header = AppConfig.header_info;
            this.http.POSTMETHOD(this.domainName + 'scenario/verifyDeletedScenario/', ScenarioDetails,
                header).then((res: any) => {
                    resolve(res);
                }, (err) => {
                    reject(err)
                }).catch(err => { reject(err); console.log(err); });

        })
    }

}
