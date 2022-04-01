import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public addUserForm: FormGroup;

  public save_clicked: boolean;
  update_clicked

  tenantEncryptData
  constructor(public registerService: RegisterService, private router: Router, private toastr: ToastrService) {
    this.save_clicked = false;
    this.addUserForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'),
      // email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+(\.[_a-z0-9]+)$'),
      Validators.required]),
      mobile: new FormControl('', [Validators.minLength(10),
      Validators.maxLength(10),
      Validators.required,
      Validators.pattern('[0-9]*')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(35),
      this.validatePassword
      ]),
      confirmPassword: new FormControl('', Validators.required),
    }, this.checkPasswordMatch('password', 'confirmPassword')
    );
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
   * Its used validate enterd value is number or not.
   * @param event typed value in textbox
   */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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


  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    return k != 64
  }
  tenantPreFix
  ngOnInit() {
    // let tenantDetails = {
    //   tenantDeatails: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail,
    //   LoginKey: ''
    // }
    // this.registerService.scenarioRedirect(tenantDetails).then((result) => {
    //   this.tenantEncryptData = result
    //   this.tenantPreFix = this.tenantEncryptData[0].tenantPrefix
    // })
  }

  onSubmit(data: any, frm_valid: boolean) {
    this.save_clicked = true;
    if (!frm_valid) {
      return false;
    }
    // let usernameCheck = (data.email).includes("@")
    // if (usernameCheck) {        
    //   this.toastr.error('Invalid email', '')
    //   return false;
    // }else{

      data['register'] = true
      data['tenantdetails'] = this.tenantEncryptData
      data['email'] = (data.email).toLowerCase()
      console.log(data)
      // data['tenantEncptdetail']=JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail
      // this.registerService.sendRegisterdata(data).then((result) => {
      //   if(result.success){
      //     this.toastr.success(result.message, '');
      //     this.router.navigate(['/pages/login']);
      //   }else{
      //     this.toastr.error(result.message, '');
      //   }  
      // })
    //}

  }

  logion(){
  this.router.navigate(['/login'], { queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
  }


}
