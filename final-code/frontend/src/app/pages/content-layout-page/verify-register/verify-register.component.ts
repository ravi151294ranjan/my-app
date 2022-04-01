import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { VerifyRegisterService } from './verify-register.service';

@Component({
  selector: 'app-verify-register',
  templateUrl: './verify-register.component.html',
  styleUrls: ['./verify-register.component.scss']
})
export class VerifyRegisterComponent implements OnInit {
  urlstateparams
  urlstateparams_id
  constructor(private routes: ActivatedRoute,
    private router: Router, private route: ActivatedRoute,
    private verifyRegisterService: VerifyRegisterService,
    private location: Location, private toastr: ToastrService) {

    this.routes.params.subscribe((params: any) => {
      this.urlstateparams_id = params
      this.route.queryParams
        .subscribe(params => {
          this.urlstateparams = params
          localStorage.setItem('tenantDeatails', JSON.stringify({ tenantDeatails: this.urlstateparams }));
          localStorage.setItem('tenantEncryptdataUrl', JSON.stringify({ tenantDeatails: this.urlstateparams }));
        })
    })
  }
  ngOnInit() {
    let verifyEmailId = {encptId:this.urlstateparams_id.id}
    this.verifyRegisterService.verifyEmail(verifyEmailId).then((result) => {
      if(result.success){
        this.toastr.success(result.message, '');
        this.router.navigate(['./login'], { queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      }else{
        this.toastr.error(result.message, '');
        this.router.navigate(['./login'], { queryParams: { tendetail: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      }
    })
  }
}
