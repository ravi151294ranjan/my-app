import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { AppConfig } from 'app/shared/services/app_config';
import { environment } from 'environments/environment';
// import { config } from './../../config';
// import { Tokens } from '../models/tokens';
export class Tokens {
  jwt: string;
  refreshToken: string;
}

export const config = {
  apiUrl: environment.apiURL
};

@Injectable()
export class AuthService {
  domainName = AppConfig.IP_Address
  token: string;

  constructor(private http: HttpClient) {}

  signupUser(email: string, password: string) {
    // your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    // your code for checking credentials and getting tokens for for signing in user
  }

  // logout() {
  //   this.token = null;
  // }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    // here you can check if user is authenticated or not through his token
    return true;
  }








  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private loggedUser: string;


  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

  logout() {
    this.token = null;
    return this.http.post<any>(`${this.domainName}tokenGen/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    console.log(`${this.domainName}/tokenGen/refresh`)
    return this.http.post<any>(`${this.domainName}tokenGen/refresh/`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      console.log(tokens)
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken() {
    // return ( JSON.parse(localStorage.loginInfonetApp).token)
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {

    localStorage.setItem('loginInfonetApp', JSON.stringify({ token:jwt }));
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
