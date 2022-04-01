import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  /**
   * handleError to handel the error part.
   * @param error its contain error message.
   */
  private handleError(error: Response | any) {
    return throwError(error);
  }

  constructor(public http: HttpClient) { }

  /**
   * POSTMETHOD used to subscribe the postservice method.
   * @param domain Its define the domain address.
   * @param params Its contain the parameters of that method.
   * @param header Its contain the header with auth token.
   */
  POSTMETHOD(domain: string, params: any, header?: any) {
    return new Promise((resolve, reject) => {
      this.postService(domain, params, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
   * postService used to call the http post service.<br>
   * Its used to define the auth token with header value.
   * @param url Its define the domain address.
   * @param params Its contain the parameters of that method.
   * @param header Its contain the header with auth token.
   */
  postService(url: any, params: any, header: any) {
    let options;
    const keyVal = 'LoginKey' in params
    if (!keyVal) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-auth-token', header.value);
      // headers = headers.append('tendetail', header.tendetail);
      options = {
        headers
        // headers: new HttpHeaders().append('x-auth-token', header.value)
      };
    } else {
      options = {
        headers: header
      };
    }
    // requestOptions.params.set('Authorization', params.token);
    return this.http.post(url, params, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }
  /**
   * PUTMETHOD used to subscribe the putService method.
   * @param domain Its define the domain address.
   * @param params Its contain the parameters of that method.
   * @param header Its contain the header with auth token.
   */
  PUTMETHOD(domain: string, params: any, header?: any) {
    return new Promise((resolve, reject) => {
      this.putService(domain, params, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
 * putService used to call the http put service.<br>
 * Its used to define the auth token with header value with tenant query string.
 * @param url Its define the domain address.
 * @param params Its contain the parameters of that method.
 * @param header Its contain the header with auth token.
 */
  putService(url: any, params: any, header: any) {
    let options;
    const strVal = localStorage.getItem('loginInfonetApp')

    if (strVal !== 'undefined' && strVal !== undefined && strVal != null && strVal !== 'null') {

      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-auth-token', header.value);
      // headers = headers.append('tendetail', header.tendetail);
      options = {
        headers
        // headers: new HttpHeaders().append('x-auth-token', header)
      };
    } else {
      options = {
        headers: header
      };
    }
    // requestOptions.params.set('Authorization', params.token);
    return this.http.put(url, params, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }

  /**
 * DELETEMETHOD used to subscribe the deleteService method.
 * @param domain Its define the domain address.
 * @param header Its contain the header with auth token.
 */
  DELETEMETHOD(domain: string, header?: any) {
    return new Promise((resolve, reject) => {
      this.deleteService(domain, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
* deleteService used to call the http delete service method.<br>
* Its used to define the auth token with header value with tenant query string.
* @param url Its define the domain address.
* @param header Its contain the header with auth token.
*/
  deleteService(url: any, header: any) {
    let options;
    const strVal = localStorage.getItem('loginInfonetApp')
    if (strVal !== 'undefined' && strVal !== undefined && strVal != null && strVal !== 'null') {

      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-auth-token', header.value);
      // headers = headers.append('tendetail', header.tendetail);
      options = {
        headers
        // headers: new HttpHeaders().append('x-auth-token', header)
      };
    } else {
      options = {
        headers: header
      };
    }

    return this.http.delete(url, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }
  /**
 * GETMETHOD used to subscribe the getService method.
 * @param domain Its define the domain address.
 * @param header Its contain the header with auth token.
 */
  GETMETHOD(domain: string, header?: any) {
    return new Promise((resolve, reject) => {
      this.getService(domain, header).subscribe((result) => {
        return resolve(result)
      }, (error: any) => {
        return reject(error);
      })
    })
  }
  /**
* getService used to call the http get service method.<br>
* Its used to define the auth token with header value with tenant query string.
* @param url Its define the domain address.
* @param header Its contain the header with auth token.
*/
  getService(domain: any, header: any) {
    let options;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('x-auth-token', header.value);
    // headers = headers.append('tendetail', header.tendetail);

    options = {
      headers
      // headers: new HttpHeaders().append('x-auth-token', header)
    };
    return this.http.get(domain, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }


  /**
 * POSTMETHODNoToken used to subscribe the postServiceNoToken method.
 * @param domain Its define the domain address.
 * @param params Its contain the parameters of that method.
 * @param header Its contain the header value only.
 */


  POSTMETHODNoToken(domain: string, params: any, header?: any) {
    return new Promise((resolve, reject) => {
      this.postServiceNoToken(domain, params, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
 * postServiceNoToken used to call the http post service.<br>
 * Its used to define the header value with tenant query string.
 * @param url Its define the domain address.
 * @param params Its contain the parameters of that method.
 * @param header Its contain the header value.
 */
  postServiceNoToken(url: any, params: any, header: any) {
    let options;

    options = {
      headers: header
    };
    // requestOptions.params.set('Authorization', params.token);
    return this.http.post(url, params, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }

  /**
   * POSTMETHOD_SuperAdmin used to subscribe the postService_SuperAdmin method.<br>
   * In Super admin method, It doesnot contain the tenant query string.
   * @param domain Its define the domain address.
   * @param params Its contain the parameters of that method.
   * @param header Its contain the header with auth token.
   */
  POSTMETHOD_SuperAdmin(domain: string, params: any, header?: any) {
    return new Promise((resolve, reject) => {
      this.postService_SuperAdmin(domain, params, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
 * postService_SuperAdmin used to call the http post service.<br>
 * Its used to define the auth token with header value.
 * @param url Its define the domain address.
 * @param params Its contain the parameters of that method.
 * @param header Its contain the header with auth token.
 */
  postService_SuperAdmin(url: any, params: any, header: any) {
    let options;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('x-auth-token', header.value);
    options = {
      headers
    };
    return this.http.post(url, params, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }

  /**
   * GETMETHOD_SuperAdmin used to subscribe the getService_SuperAdmin method.<br>
   * In Super admin method, It doesnot contain the tenant query string.
   * @param domain Its define the domain address.
   * @param header Its contain the header with auth token.
   */
  GETMETHOD_SuperAdmin(domain: string, header?: any) {
    return new Promise((resolve, reject) => {
      this.getService_SuperAdmin(domain, header).subscribe((result) => {
        return resolve(result)
      }, (error: any) => {
        return reject(error);
      })
    })
  }
  /**
* getService_SuperAdmin used to call the http get service.<br>
* Its used to define the auth token with header value.
* @param url Its define the domain address.
* @param header Its contain the header with auth token.
*/
  getService_SuperAdmin(domain: any, header: any) {
    let options;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('x-auth-token', header.value);
    options = { headers };
    return this.http.get(domain, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }

  /**
   * DELETEMETHOD_SuperAdmin used to subscribe the deleteService_SuperAdmin method.<br>
   * In Super admin method, It doesnot contain the tenant query string.
   * @param domain Its define the domain address.
   * @param params Its contain the parameters of that method.
   * @param header Its contain the header with auth token.
   */
  DELETEMETHOD_SuperAdmin(domain: string, header?: any) {
    return new Promise((resolve, reject) => {
      this.deleteService_SuperAdmin(domain, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
* deleteService_SuperAdmin used to call the http delete service.<br>
* Its used to define the auth token with header value.
* @param url Its define the domain address.
* @param params Its contain the parameters of that method.
* @param header Its contain the header with auth token.
*/
  deleteService_SuperAdmin(url: any, header: any) {
    let options;
    const strVal = localStorage.getItem('loginInfonetApp')
    if (strVal !== 'undefined' && strVal !== undefined && strVal != null && strVal !== 'null') {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-auth-token', header.value);
      options = {
        headers
      };
    } else {
      options = {
        headers: header
      };
    }

    return this.http.delete(url, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }

  /**
   * PUTMETHOD_SuperAdmin used to subscribe the putService_SuperAdmin method.<br>
   * In Super admin method, It doesnot contain the tenant query string.
   * @param domain Its define the domain address.
   * @param params Its contain the parameters of that method.
   * @param header Its contain the header with auth token.
   */

  PUTMETHOD_SuperAdmin(domain: string, params: any, header?: any) {
    return new Promise((resolve, reject) => {
      this.putService_SuperAdmin(domain, params, header).subscribe((result) => {
        return resolve(result);
      }, (error: any) => {
        return reject(error);
      });
    });
  }
  /**
* putService_SuperAdmin used to call the http put service.<br>
* Its used to define the auth token with header value.
* @param url Its define the domain address.
* @param params Its contain the parameters of that method.
* @param header Its contain the header with auth token.
*/
  putService_SuperAdmin(url: any, params: any, header: any) {
    let options;
    const strVal = localStorage.getItem('loginInfonetApp')

    if (strVal !== 'undefined' && strVal !== undefined && strVal != null && strVal !== 'null') {

      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-auth-token', header.value);
      options = {
        headers
      };
    } else {
      options = {
        headers: header
      };
    }
    // requestOptions.params.set('Authorization', params.token);
    return this.http.put(url, params, options).pipe(
      map((result) => {
        return result;
      }), catchError(this.handleError));
  }

}
