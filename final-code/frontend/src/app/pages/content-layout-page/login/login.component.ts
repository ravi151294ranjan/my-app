import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/filter';
import { PlatformLocation } from '@angular/common'
import { RegisterService } from '../register/register.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginFormData: FormGroup;
  public cfm_clicked: boolean;
  urlstateparams
  vsceData
  tenantEncryptData
  tenantPreFix
  regBtn = false
  userInfo
  superAdminUI = false

  password;
  show = false;
  @ViewChild('f', { static: false }) loginForm: NgForm;


  /**
   * On Constructor to get Encrypted data and store in Localstorage.
   */

  constructor(private router: Router, location: PlatformLocation, public loginService: LoginService,
    private formBuilder: FormBuilder, private routes: ActivatedRoute, public registerService: RegisterService,
    private route: ActivatedRoute, private toastr: ToastrService) {
    try {
      //browser back button disable start
      // location.onPopState(() => {
      //   console.log('pressed back in add!!!!!');
      //   // this.router.navigateByUrl('./pages/login');
      //   history.forward();
      // })
      //browser back button disable end

      this.cfm_clicked = false;
      this.loginFormData = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        LoginKey: ['']
      })
      this.route.queryParams
        .subscribe(params => {
          this.urlstateparams = params
        })
    } catch (e) {
      this.toastr.error('An internal error occurred. Please try again later', '')
    }
  }
  /**
   * on Starting to check and remove userInfo and tenantusercreation value in localstorage.
   */
  ngOnInit() {
    try {
      this.password = 'password';
      if (localStorage.tenantDeatails) {
        // this.router.navigate(['./pages/login'], { queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
        this.router.navigate(['./login']);
      }
      this.regBtn = true
      // if (this.urlstateparams.tendetail) {
      //   this.regBtn = true
      // }
    } catch (e) {
      this.toastr.error('An internal error occurred. Please try again later', '')
    }
  }
  /**
   * To verify the credentials to access the application.,br>
   * Get encrypted data in URL. BAsed on that to redirect specific tenant. <br>
   * If URL does not contain exncrypted data its represent super admin login.
   * @param data  Its contain login credentails.
   * @param frm_valid Textbox validation.
   */
  // On submit button click
  onSubmit(data: any, frm_valid: boolean) {
    try {
      this.cfm_clicked = true;
      if (!frm_valid) {
        return false;
      }
      let userData= {
            LoginKey: "",
            password: data.password,
            username: data.username
          }
      this.loginService.postMethod(userData, this.urlstateparams).then((result) => {
        try {
          if (result) {
            console.log(result)
            if (result.success) {
              localStorage.setItem('loginInfonetApp', JSON.stringify({ token: result.token }));
              localStorage.setItem('refreshToken', result.refreshToken);
              localStorage.setItem('JWT_TOKEN', result.token);
              localStorage.setItem('UserInfo', JSON.stringify({ userdetails: result.response[0] }));
              // if (Object.keys(this.urlstateparams).length > 0) {
              //   if ('redirectTo' in this.urlstateparams) {
              //     this.router.navigate(['./pages/scenario-test', this.urlstateparams.val]);
              //   } else {
              //     if (localStorage.scenarioidShortlink) {
              //       let sceId = {
              //         tenantCode: JSON.parse(localStorage.scenarioidShortlink).tenantCode,
              //         scenarioUrlCode: JSON.parse(localStorage.scenarioidShortlink).scenarioUrlCode
              //       }
              //       this.loginService.scenarioRedirect(sceId).then((sceData) => {
              //         this.vsceData = sceData
              //         if (this.vsceData.success) {
              //           window.location.href = this.vsceData.resdata[0].longUrl
              //         } else {

              //           this.toastr.error('Invalid Secnario Url', '')
              //           localStorage.removeItem('scenarioidShortlink')
              //         }
              //       })
              //     } else {
              //       const type = 1
              //       if (result.response[0].firstLogin == 1) {
              //         this.router.navigate(['./pages/pwdchangeFirstLogin']);
              //       } else {
              //         if (result.response[0].emailVerified == 1) {
              //           this.toastr.error('User not verified. Please check your email to verify the user.', '')
              //         } else {

              //           this.userInfo = JSON.parse(localStorage.UserInfo).userdetails
              //           if (this.userInfo.role === '2') {
              //             this.router.navigate(['./pages/scenario'])
              //           } else {
              //             this.router.navigate(['./pages/dashboard', type])
              //           }

              //         }
              //       }
              //     }
              //   }
              // } else {

              //   const type = 1
              //   this.router.navigate(['./pages/dashboard', type])
              // }

              const type = 1
              this.router.navigate(['./dashboard'])
            } else {
              this.toastr.error(result.message, '')
            }
          } else {
            this.toastr.error('An internal error occurred. Please try again later', '')
          }
        } catch (e) {
          this.toastr.error('An internal error occurred. Please try again later', '')
        }
        // this.router.navigate(['./pages/dashboard',], { queryParams: { type: '1', } });
      })
    } catch (e) {
      this.toastr.error('An internal error occurred. Please try again later', '')
    }
  }

  /**
   * To navigate register page.
   */
  register() {
    try {
      this.router.navigate(['/register']);
      // if (this.urlstateparams.tendetail) {
      //   this.router.navigate(['/pages/register']);
      // }
    } catch (e) {
      this.toastr.error('An internal error occurred. Please try again later', '')
    }

  }

  /**
    * Password view and hide.
    */
  onClick() {
    try {
      if (this.password === 'password') {
        this.password = 'text';
        this.show = true;
      } else {
        this.password = 'password';
        this.show = false;
      }
    } catch (e) {
      this.toastr.error('An internal error occurred. Please try again later', '')
    }
  }



}
