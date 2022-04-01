import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { shortUrlService } from './shorturl.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-shorturl-redirection',
  templateUrl: './shorturl-redirection.component.html',
  styleUrls: ['./shorturl-redirection.component.scss']
})
export class ShorturlRedirectionComponent implements OnInit {
  urlstateparams
  constructor(private routes: ActivatedRoute,
    private shortUrlService: shortUrlService, private router: Router,
    private location: Location, private toastr: ToastrService
  ) {

    this.routes.params.subscribe((params: any) => {
      this.urlstateparams = params
    })

  }

  vsceData
  ngOnInit() {
    let urlshortValidate = {
      shortId: this.urlstateparams.id,
      LoginKey: ['']
    }
    this.shortUrlService.postMethod(urlshortValidate).then((result) => {
      if (result.status == 200) {
        if (this.urlstateparams.scenarioid != undefined) {
          if (localStorage.loginInfonetApp) {
            let sceId = {
              tenantCode: this.urlstateparams.id,
              scenarioUrlCode: this.urlstateparams.scenarioid
            }
            this.shortUrlService.scenarioRedirect(sceId).then((sceData) => {
              this.vsceData = sceData
              if (this.vsceData.success) {
                window.location.href = this.vsceData.resdata[0].longUrl
              } else {
                this.toastr.error('Invalid Url', '')
              }
            })
          } else {
            localStorage.setItem('scenarioidShortlink', JSON.stringify({
              tenantCode: this.urlstateparams.id,
              scenarioUrlCode: this.urlstateparams.scenarioid
            }));
            window.location.href = result.data.Tenant_Url
          }

        } else {
          if (localStorage.loginInfonetApp) {
            localStorage.removeItem('scenarioidShortlink')
            const type = 1
            this.router.navigate(['/dashboard', type])
          } else {
            localStorage.clear();
            window.location.href = result.data.Tenant_Url;

          }

        }
      } else {
        this.router.navigate(['/error'])
        this.toastr.error('Invalid Url', '')
      }

    })
  }

}
