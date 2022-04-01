import { Component, OnInit,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../register/register.service';
import { ForgotPasswordService } from '../forgotpassword.service'
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-passwordredirect',
  templateUrl: './passwordredirect.component.html',
  styleUrls: ['./passwordredirect.component.scss']
})

export class PasswordredirectComponent implements OnInit {
  public addUserForm: FormGroup;
  urlstateparams
  urlstateparams_id
  contentView = false
  public save_clicked: boolean;
//   @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
//     console.log("Processing beforeunload...", 'this.myValue');
// }
  constructor(private routes: ActivatedRoute, private router: Router, private toastr: ToastrService, private forgotPasswordService: ForgotPasswordService,
    private route: ActivatedRoute) {
    this.save_clicked = false;
    this.addUserForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(35),
      this.validatePassword
      ]),
      confirmPassword: new FormControl('', Validators.required)
    }, this.checkPasswordMatch('password', 'confirmPassword')
    );
    this.routes.params.subscribe((params: any) => {
      this.urlstateparams_id = params
      console.log( this.urlstateparams_id)
      this.route.queryParams
        .subscribe(params => {
          this.urlstateparams = params
          // localStorage.setItem('tenantDeatails', JSON.stringify({ tenantDeatails: this.urlstateparams }));
          // localStorage.setItem('tenantEncryptdataUrl', JSON.stringify({ tenantDeatails: this.urlstateparams }));
        })
    })

    
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
  userData_Update
  ngOnInit() {

    // window.onunload = function(e) {
    //   // Firefox || IE
    //   e = e || window.event;
       
    //   var y = e.pageY || e.clientY;
       
    //   if(y < 0)  alert("Window closed");
    //   else alert("Window refreshed");
       
    //   }
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
  });
    // window.onbeforeunload = function (evt) {
    //   var message = 'Are you sure you want to leave?';
    //   if (typeof evt == 'undefined') {
    //     evt = window.event;
    //   }
    //   if (evt) {
    //     evt.returnValue = message;
    //   }
    //   return message;
    // }

    let params = {
      id: this.urlstateparams_id.id
    }
    console.log(params)
    this.forgotPasswordService.validateId(params).then((result) => {
      console.log(result)
      this.userData_Update = result
      if (result.length > 0) {
        this.contentView = true
      } else {
        this.contentView = false
        this.toastr.error('Invalid Url', '')
      }
    })
  }

  changePassword(add_data: any, isValid: boolean) {
    this.save_clicked = true;
    if (!isValid) {
      return false;
    }
    let params = {
      password: add_data.password,
      email: this.userData_Update[0].email
    }
    this.forgotPasswordService.updatePassword(params).then((result) => {
      if (result.success) {
        this.toastr.success(result.message, '')
        this.router.navigate(['./login']);
      } else {
        this.toastr.error('Link Invalid', '')
        this.router.navigate(['./login']);
      }
    })

  }

  loginPage() {
    this.router.navigate(['./login']);
  }

}
