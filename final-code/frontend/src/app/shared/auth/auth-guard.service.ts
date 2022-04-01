import { CanActivate, ActivatedRoute,Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private route: ActivatedRoute,private router: Router) { 


  }
/**
 * Interface that a class can implement to be a guard deciding if a route can be activated.
 * @param route its represent the route module.
 * @param state its represent the navigation state.
 */
urlstateparams
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.loginInfonetApp !== undefined) {
      return this.authService.isAuthenticated();
    } else {
      this.router.navigate(['login'])
      // if(route.queryParams){
      //   localStorage.setItem('tenantDeatails', JSON.stringify({ tenantDeatails: route.queryParams.tendetail }));
      //   localStorage.setItem('tenantEncryptdataUrl', JSON.stringify({ tenantDeatails:route.queryParams.tendetail }));
      //   this.router.navigate(['pages/login'],{ queryParams: { tendetail:  route.queryParams.tendetail} });
      // }else{
      //   this.router.navigate(['pages/login'])
      // }
      // if(route.queryParams){
      //   this.router.navigate(['pages/login'],{ queryParams: route.queryParams });
      // }else{
      //   this.router.navigate(['pages/login'])
      // }

      // if(localStorage.tenantDeatails){
      //   this.router.navigate(['pages/login'],{ queryParams: { tendetail:  JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      // }else{
      //   this.router.navigate(['pages/login'])
      // }
      // this.router.navigate(['pages/login'],{ queryParams: { tendetail:  JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail } });
      return false
    }
  }
  /**
   * Interface that a class can implement to be a guard deciding if a child route can be activated.
   */
  canActivateChild() {
    console.log('checking child route access');
    return true;
  }
}
