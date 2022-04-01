import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LayoutService } from '../services/layout.service';
import { ConfigService } from '../services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  currentLang = "en";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  public isCollapsed = true;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  public config: any = {};

  constructor(private router: Router, public translate: TranslateService, public authService: AuthService,
    private layoutService: LayoutService, private configService: ConfigService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : "en");

  }

  ngOnInit() {
    this.config = this.configService.templateConf;
  }

  ngAfterViewInit() {
    if (this.config.layout.dir) {
      const dir = this.config.layout.dir;
      if (dir === "rtl") {
        this.placement = "bottom-left";
      } else if (dir === "ltr") {
        this.placement = "bottom-right";
      }
    }
  }

  /**
   * ChangeLanguage used to change the application localaisation.
   * @param language Its represent the language
   */
  ChangeLanguage(language: string) {
    this.translate.use(language);
  }
  /**
   * ToggleClass used to increase the size and decrease the size of toggle button.
   */
  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }
  /**
   * toggleNotificationSidebar used to emit the notification side bar. 
   */
  toggleNotificationSidebar() {
    this.layoutService.emitChange(true);
  }
  /**
   * toggleSidebar method used to view and hide in side bar. 
   */
  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

  /**
   * logOut methodfor logout process.<br>
   * Based on the user role its define the url querystring and to naigation.
   */

  logOut() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          if (JSON.parse(localStorage.UserInfo).userdetails.role == '0') {
            localStorage.clear();
            this.router.navigate(['./login']);
          } else {
            if (JSON.parse(localStorage.UserInfo).userdetails.role == '1' && JSON.parse(localStorage.UserInfo).userdetails.superAdmin) {
              this.router.navigate(['./tenantchanging']);
            } else {
              this.router.navigate(['./login']);
              localStorage.clear();
            }
          }
        }
      });
  }

  // logout() {
  //   this.authService.logout()
  //     .subscribe(success => {
  //       if (success) {
  //         this.router.navigate(['/login']);
  //       }
  //     });
  // }




}
