import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker'
import { ConnectionService } from 'ng-connection-service';
import { filter } from 'rxjs/operators';
const MAIN_PAGE_TITLE = "EVX Portal";
import { UpdateService } from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent implements OnInit, OnDestroy {


  constructor(private router: Router, 
    private swPush: SwPush, 
    private connectionService: ConnectionService,
    private updates: SwUpdate, 
    private sw: UpdateService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {

 
  }
  /**
   * app component is a main component to connect all other components.
   */
  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe(() => {
      var rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {       
        let title = (typeof data['title'] ==="undefined") ? MAIN_PAGE_TITLE : `${data['title']} | ${MAIN_PAGE_TITLE}`;
        this.titleService.setTitle(title)})
    })
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
 
  }

  ngOnDestroy() {
   
  }



}