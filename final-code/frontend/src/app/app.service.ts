
import { Subscription, interval } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SwPush,SwUpdate } from '@angular/service-worker'
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class UpdateService {

    constructor(public updates: SwUpdate) {
      if (updates.isEnabled) {
       
          updates.checkForUpdate()
        interval(600 * 600 * 60).subscribe(() => updates.checkForUpdate()
          .then(() => console.log('checking for updates')));
      }
    }
  
    public checkForUpdates(): void {
      this.updates.available.subscribe(event => {
        this.promptUser()
    });
    }
  
    private promptUser(): void {
      console.log('updating to new version');
      this.updates.activateUpdate().then(() => document.location.reload()); 
    }


}