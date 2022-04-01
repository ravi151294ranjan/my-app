import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { throwError, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService, private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }

    return next.handle(request).pipe(catchError((error) => {
      if (error instanceof HttpErrorResponse && (error.status === 307 || error.status === 401 )) {
        // || error.status === 400
        return this.handle401Error(request, next);
      } else if (error instanceof HttpErrorResponse && (error.status === 403)) {
        return this.handle403Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'x-auth-token': `${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }));

    } else {

      this.router.navigate(['./login']);
      this.toastr.error('Session Expired', '');

      // return this.refreshTokenSubject.pipe(
      //   filter(token => token != null),
      //   take(1),
      //   switchMap(jwt => {
      //     return next.handle(this.addToken(request, jwt));
      //   }));
    }
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
      this.router.navigate(['./login']);
      this.toastr.error('Please login again', 'Unauthorized Access');
      return throwError('Unauthorized Access');
  }
}