import { HostListener, Component, OnInit, AfterViewInit, ViewChild ,OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ScenarioTestService } from './scenario-test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { AppConfig } from '../../../shared/services/app_config';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
declare var UnityLoader: any;
@Component({
  selector: 'app-scenario-test',
  templateUrl: './scenario-test.component.html',
  styleUrls: ['./scenario-test.component.scss']
})
export class ScenarioTestComponent implements OnInit, OnDestroy {
  domainName = AppConfig.IP_Redirect
  urlstateparams
  encryptSecretKey = '789456123'
  decryptValue: any
  myTemplate: string;
  urlstateparamsTenanrValue
  @ViewChild('content',{static:false}) content: any;
  constructor(private modalService: NgbModal,
     private routes: ActivatedRoute, private location: Location, public spinnerValue: NgxSpinnerService,
     private route: ActivatedRoute, private toastr: ToastrService,
    private router: Router, private ScenarioService: ScenarioTestService) {
    // this.routes.params.subscribe((params: any) => {
    //   console.log(params)
    //   this.urlstateparams = params
    //   // this.decryptValue = this.decryptData(this.urlstateparams.id)
      this.route.queryParams
        .subscribe(params => {
          console.log(params)
          this.urlstateparamsTenanrValue = params
    //   //     if (Object.keys(this.urlstateparamsTenanrValue).length > 0) {
    //   //       console.log("==========")
    //   //       if ('tendetail' in params) {
    //   //         localStorage.setItem('tenantDeatails', JSON.stringify({ tenantDeatails: this.urlstateparamsTenanrValue }));
    //   //         localStorage.setItem('tenantEncryptdataUrl', JSON.stringify({ tenantDeatails: this.urlstateparamsTenanrValue }));
    //   //       }
    //   //     }
        })

    // //  this.location.replaceState(`/pages/scenario-test/${this.urlstateparams.id}?tendetail=` + JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail);
    // })

    // this.myTemplate = `<iframe src="./assets/netApp_v2/index.html" frameborder="0"
    // style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;
    // position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe>`;

  }

  /**
   * decryptData used to extract the ecncrypted data from URL.
   * @param data Its contain url encrypted data.
   */
  // decryptData(data) {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey.trim());
  //     if (bytes.toString()) {
  //       return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //     }
  //     return data;
  //   } catch (e) {
  //   }
  // }

  /**
   * To verify the token validity using this.ScenarioService.verifyToken service.
   */
  scenarioDeleteValue
  ngOnInit() {


    // const loader = (window as any).UnityLoader;
    // this.gameInstance = loader.instantiate(
    //   'gameContainer',
    //   // '/assets/netApp_v2/Build/netApp_v2.json', {
    //   '/assets/ToolingU_AppShell_Build/Build/ToolingU_AppShell_Build.json', {
    //   onProgress: (gameInstance: any, progress: number) => {
    //     if (!gameInstance.Module) {
    //       return;
    //     }
    //     const loader = document.querySelector<HTMLElement>("#loader");
    //     if (!gameInstance.progress) {
    //       const progress = document.querySelector<HTMLElement>("#loader .progress");
    //       // progress.style.display = "block";
    //       gameInstance.progress = progress.querySelector(".full");
    //       // loader.querySelector<HTMLElement>(".spinner").style.display = "none";
    //     }
    //     gameInstance.progress.style.transform = `scaleX(${progress})`;
    //     if (progress === 1 && !gameInstance.removeTimeout) {
    //       gameInstance.removeTimeout = setTimeout(function () {
    //         loader.style.display = "none";
    //       }, 2000);
    //     }
    //     // this.progress = progress;
    //     // if (progress === 1) {
    //     //   this.isReady = true;
    //     // }
    //   }, Module: {
    //     cacheControl: { "default": "immutable" },
    //   }
    // })

  }

  gameInstance: any;
  progress = 0;
  isReady = false;

  // ngAfterViewInit() {


  //   //  var gameInstance = UnityLoader.instantiate("gameContainer", 'src/assets/netApp_v2/Build/Netapp v2.json', {onProgress: UnityProgress});
  //   // function UnityProgress(gameInstance, progress) {
  //   //   if (!gameInstance.Module) {
  //   //     return;
  //   //   }
  //   //   const loader = document.querySelector<HTMLElement>("#loader");
  //   //   if (!gameInstance.progress) {
  //   //     const progress = document.querySelector<HTMLElement>("#loader .progress");
  //   //     progress.style.display = "block";
  //   //     gameInstance.progress = progress.querySelector(".full");
  //   //     loader.querySelector<HTMLElement>(".spinner").style.display = "none";
  //   //   }
  //   //   gameInstance.progress.style.transform = `scaleX(${progress})`;
  //   //   if (progress === 1 && !gameInstance.removeTimeout) {
  //   //     gameInstance.removeTimeout = setTimeout(function() {
  //   //         loader.style.display = "none";
  //   //     }, 2000);
  //   //   }
  //   // }
  // }

  ScenarioFunction() {

    // this.router.navigate(['./pages/login']);

    // this.myTemplate = `<iframe src="./assets/netApp_v2/index.html" frameborder="0"
    // style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;
    // position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe>`;
  }

  @HostListener('window:message',['$event'])
  onMessage(e)
  {
    if(e.data === 'uploadpopup')
    {
      this.modalService.open(this.content);
    }
  }

  closeModal(id: string) {
    this.modalService.dismissAll(id);
  }

  ngOnDestroy(): void {
    if(this.gameInstance){
    this.gameInstance.Quit();
    }
  }
  // let DeleteScenarioCheck = {
  //   ScenarioId: this.decryptValue.ScenarioId,
  //   ScenarioName: this.decryptValue.ScenarioTitle,
  // }

  // this.ScenarioService.verifyDeletedScenario(DeleteScenarioCheck).then((scenarioDelete) => {
  //   console.log(scenarioDelete)
  //   this.scenarioDeleteValue = scenarioDelete
  //   if (this.scenarioDeleteValue.success) {

}
