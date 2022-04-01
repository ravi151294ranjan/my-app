/**
 * Author: Dhanabalan.cs
 * Local Storage File
 * Purpose: Local Storage set and get items functions available here
 */
import {Injectable} from "@angular/core";
import {environment} from "./../../../environments/environment";

@Injectable({
  providedIn: "root",
})

export class LocalStore {

  static setItem(key, value):void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  static getItem(key):any {
    return JSON.parse(localStorage.getItem(key));
  }

  static checkItem(key): boolean {
    return (localStorage.getItem(key) === null) ? false : true;
  }

  static removeItem(key):any {
    return (localStorage.getItem(key) === null) ? false : localStorage.removeItem(key);
  }
  
}