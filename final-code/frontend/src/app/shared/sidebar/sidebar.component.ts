import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import { ROUTES } from './sidebar-routes.config';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { customAnimations } from '../animations/custom-animations';
import { ConfigService } from '../services/config.service';

import { RouteInfo } from './sidebar.metadata';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: customAnimations
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('toggleIcon', { static: false }) toggleIcon: ElementRef | undefined;
  public menuItems: any[] | undefined;
  depth: number | undefined;
  activeTitle: string | undefined;
  activeTitles: string[] = [];
  expanded: boolean | undefined;
  nav_collapsed_open = false;
  logoUrl = 'assets/img/logo.png';
  public config: any = {};
  userInfo: any
  tenantName='Admin'
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private configService: ConfigService,
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }
  }

/**
 * On ngOnInit method to get user details value in local storage.
 */
  ngOnInit() {
    this.config = this.configService.templateConf;
    this.menuItems = ROUTES;
    console.log(this.menuItems[0].submenu.length);

    if (localStorage.getItem("UserInfo") !== null) {
      this.userInfo = JSON.parse(localStorage.UserInfo).userdetails
      if(this.userInfo.tenantName!== undefined){
        this.tenantName=this.userInfo.tenantName
      }
      if (this.config.layout.sidebar.backgroundColor === 'white') {
        this.logoUrl = 'assets/img/logo-dark.png';
      } else {
        this.logoUrl = 'assets/img/logo.png';
      }
      this.UserBasedMenuItems()
    }
  }
/**
 * UserBasedMenuItems define the side bar menu items based on user role.
 */
  UserBasedMenuItems() {
    if(this.userInfo.roleInfo.type == 'userdefined'){
      this.menuItems = this.menuItems.filter( (e) => {
        let inScenarios=['usermanagement', 'contentmanagement']
        if(inScenarios.indexOf(e.identifier) === -1) {
          return e;
        }
      });


     // this.menuItems = this.menuItems.filter(function (el) {
      //  return el.identifier !== 'usermanagement' || el.identifier !== 'contentmanagement';
      //}); 
    }
    // if (this.userInfo.role === '0') {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title === 'Tenants' || el.title === 'Dashboard';
    //   });
    // } else if (this.userInfo.role == '1' && this.userInfo.superAdmin) {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title !== 'Tenants';
    //   });
    // } else if (this.userInfo.role == '1' && (!this.userInfo.superAdmin || this.userInfo.superAdmin == undefined)) {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title !== 'Tenants' && el.title !== 'SuperAdmin'
    //   });
    // } else if (this.userInfo.role === '2') {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title === 'Reports' || el.title === 'Scenarios';
    //   });
    // }




    // if (this.userInfo.role === '1' && !this.userInfo.superAdmin) {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title !== 'Tenants' || el.title !== 'SuperAdmin'
    //   });
    // }
    // if (!this.userInfo.superAdmin) {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title == 'SuperAdmin' || el.title == 'Tenants'
    //   });
    // }
    // if (this.userInfo.role === '0') {
    //   this.menuItems = this.menuItems.filter(function (el) {
    //     return el.title === 'Tenants' || el.title === 'Dashboard';
    //   });
    // }



  }
/**
 * on ngAfterViewInit method used to view the side bar on right or left.
 */
  ngAfterViewInit() {

    setTimeout(() => {
      if (this.config.layout.sidebar.collapsed !== undefined) {
        if (this.config.layout.sidebar.collapsed === true) {
          this.expanded = false;
          // this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
          // this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
          this.nav_collapsed_open = true;
        } else if (this.config.layout.sidebar.collapsed === false) {
          this.expanded = true;
          // this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
          // this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
          this.nav_collapsed_open = false;
        }
      }
    }, 0);


  }
/**
 * toggleSlideInOut used to hide and view in side bar.
 */
  toggleSlideInOut() {
    this.expanded = !this.expanded;
  }
/**
 * handleToggle used to define the active titles.
 * @param titles 
 */
  handleToggle(titles: any) {
    this.activeTitles = titles;
  }

  // NGX Wizard - skip url change
  ngxWizardFunction(path: string) {
    if (path.indexOf('forms/ngx') !== -1) {
      this.router.navigate(['forms/ngx/wizard'], { skipLocationChange: false });
    }
  }
}
