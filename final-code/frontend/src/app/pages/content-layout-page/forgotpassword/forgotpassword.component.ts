import { Component, OnInit } from '@angular/core';
// import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { DashboardService } from './dashboard.service';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common'
import { RegisterService } from '../register/register.service';
import { ForgotPasswordService } from './forgotpassword.service'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  public addUserForm: FormGroup;
  urlstateparams
  tenantEncryptData
  tenantPreFix
  public save_clicked: boolean;
  constructor(private routes: ActivatedRoute, locations: PlatformLocation,
    private forgotPasswordService: ForgotPasswordService,
    private location: Location, private registerService: RegisterService, private toastr: ToastrService,
    private router: Router) {
    this.save_clicked = false;
    this.addUserForm = new FormGroup({
      email: new FormControl('', [Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'),
      Validators.required]),
    
      // email: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+(\.[_a-z0-9]+)$'),
      // Validators.required]),
    }
    );

    this.routes.params.subscribe((params: any) => {
      this.urlstateparams = params
    })
    // this.location.replaceState('/pages/forgotpass?tendetail=' + JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail);
  }



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

  backToLogin() {
    this.router.navigate(['/login']);
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    return k != 64
  }

  recoverData(data: any, frm_valid: boolean) {
    this.save_clicked = true;
    if (!frm_valid) {
      return false;
    }
    let tenantDetails = {
      // tenantDeatails: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail,
      LoginKey: '',
      email: data.email// + this.tenantPreFix,
      // tenantName: this.tenantEncryptData[0].tenantname
    }
    console.log(tenantDetails)
    this.forgotPasswordService.postMethod(tenantDetails).then((result) => {
      if (result.success) {
        this.toastr.success(result.message, '')
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(result.message, '')
        //this.router.navigate(['/pages/login']);
      }
    })

  }




}
