import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common'
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordService } from '../../content-layout-page/forgotpassword/forgotpassword.service'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public addUserForm: FormGroup;
  urlstateparams

  firstname: any
  lastname: any
  email: any
  mobile: any
  status: any
  public save_clicked: boolean;

  constructor(private routes: ActivatedRoute, locations: PlatformLocation,
    private location: Location, private toastr: ToastrService, private forgotPasswordService: ForgotPasswordService,
    private router: Router) { 
      this.save_clicked = false;
      this.addUserForm = new FormGroup({        
        password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(35),
        this.validatePassword
        ]),
        confirmPassword: new FormControl('', Validators.required),
      }, this.checkPasswordMatch('password', 'confirmPassword')
      );

    this.routes.params.subscribe((params: any) => {
      this.urlstateparams = params
    })
    // this.location.replaceState('/pages/profile?tendetail=' + JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail);
    this.firstname=JSON.parse(localStorage.UserInfo).userdetails.firstname
    this.lastname=JSON.parse(localStorage.UserInfo).userdetails.lastname
    this.email=JSON.parse(localStorage.UserInfo).userdetails.email
    this.mobile=JSON.parse(localStorage.UserInfo).userdetails.mobile
    this.status=JSON.parse(localStorage.UserInfo).userdetails.status
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

passwordView=false

  EditUserPassword(){
    this.addUserForm.reset()
    this.passwordView=true
  }
  closeUserPassword(){
    this.addUserForm.reset()
    this.passwordView=false
  }

  onFormSubmit(add_data: any, isValid: boolean){
    this.save_clicked = true;
    if (!isValid) {
      return false;
    }
    let params = {
      password: add_data.password,
      email: JSON.parse(localStorage.UserInfo).userdetails.email
    }

    this.forgotPasswordService.ProfilePasswordUpdate(params).then((result) => {
      if (result.success) {
        this.toastr.success(result.message, '')
        this.closeUserPassword()
      } else {
        this.toastr.error('Password not update.', '')
      }

    })
  }



  ngOnInit() {
  }

}
