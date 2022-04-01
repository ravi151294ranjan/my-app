import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PwdchangeFirstLoginService } from './pwdchange-first-login.service';
@Component({
  selector: 'app-pwdchange-first-login',
  templateUrl: './pwdchange-first-login.component.html',
  styleUrls: ['./pwdchange-first-login.component.scss']
})
export class PwdchangeFirstLoginComponent implements OnInit {
  public changePassword: FormGroup;
  urlstateparams
  public save_clicked: boolean;
  constructor(private routes: ActivatedRoute, locations: PlatformLocation,
    private location: Location, private toastr: ToastrService,
    private pwdchangeFirstLoginService: PwdchangeFirstLoginService,
    private router: Router) { 
      this.save_clicked = false;
      this.changePassword = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(35),
        this.validatePassword
        ]),
        confirmPassword: new FormControl('', Validators.required)
      }, this.checkPasswordMatch('password', 'confirmPassword')
      );
      this.routes.params.subscribe((params: any) => {
        this.urlstateparams = params
      })
      this.location.replaceState('/pwdchangeFirstLogin?tendetail=' + JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail);
      if (!localStorage.UserInfo) {
        this.router.navigate(['/login'],{ queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      }
    }

  /**
 * validatePassword method used to validate password Strength.<br>
 * Password should containt atleast one capital letter<br>
 * Its contain atleast one special charecter<br>
 * Its contain atlease one number<br>
 * Its contain atleast one small letter.
 * @param controls {String}  password value
 * @return It return boolean value.
 */
  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  /**
 * checkPasswordMatch method used to verify actual password and confirm password is same or not.
 * @param pass Its contain the actual password.
 * @param confirmPass  Its contain confirm password.
 */
checkPasswordMatch(pass: string, confirmPass: string): any {
  return (formGroup: FormGroup) => {
    const password = formGroup.controls[pass];
    const confirmPassword = formGroup.controls[confirmPass];

    // set error on matchingControl if validation fails
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }

  };
}
vFirstLogin = 0
  ngOnInit() {

    if (localStorage.UserInfo) {
      this.vFirstLogin = JSON.parse(localStorage.UserInfo).userdetails.firstLogin
    }

  }
  
  changePasswordFirstLogin(add_data: any, isValid: boolean) {
    this.save_clicked = true;
    if (!isValid) {
      return false;
    }
    let params = {
      password: add_data.password,
      email: JSON.parse(localStorage.UserInfo).userdetails.email
    }
    this.pwdchangeFirstLoginService.changePasswordFirstLogin(params).then((result) => {
      if (result.success) {
        let type=1
        this.toastr.success(result.message, '')
        if(JSON.parse(localStorage.UserInfo).userdetails.role== '1'){
              this.router.navigate(['/dashboard', type]);
            }else{
              this.router.navigate(['./scenario'])          
            }
        // this.router.navigate(['./pages/login'], { queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      } else {
        this.toastr.error('Password not update successfully.', '')
        // this.router.navigate(['./pages/login'], { queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      }
    })

  }
}
