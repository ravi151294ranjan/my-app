import { HostListener, Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { assetViewerService } from './asset-viewer.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

declare var UnityLoader: any;
@Component({
  selector: 'app-asset-viewer',
  templateUrl: './asset-viewer.component.html',
  styleUrls: ['./asset-viewer.component.scss']
})
export class AssetViewerComponent implements OnInit, OnDestroy {
  urlstateparams
  gameInstance
  constructor(private routes: ActivatedRoute,
    private assetViewerService: assetViewerService, private router: Router,
    private location: Location, private toastr: ToastrService) {
    this.routes.params.subscribe((params: any) => {
      this.urlstateparams = params
      console.log(this.urlstateparams);
    })

  }
  assetData
  ngOnInit() {
    this.assetViewerService.checkassetAvailable(this.urlstateparams.id).then((result) => {
      if (result == undefined) {
        this.toastr.error('Asset Not found.', '');
        this.router.navigate(['login'])
      } else {
        if (!result[0].success) {
          this.toastr.error('Asset Not found.', '')
          this.router.navigate(['login'])
        } else {
          this.assetData = result[0]
          this.assetShow()
        }
      }
      console.log(result)
    })
  }

  assetShow() {

    localStorage.setItem('assetData', JSON.stringify({ token: this.assetData.asset_encrypt }));
    localStorage.setItem('asset_id', JSON.stringify({ token: this.assetData._id }));

    // WILL throw violation
    document.addEventListener("wheel", function (e) {
      e.preventDefault(); // prevents default browser functionality
    });

    // will NOT throw violation
    document.addEventListener("wheel", function (e) {
      e.preventDefault(); // does nothing since the listener is passive
    }, {
      passive: true
    })

    const loader = (window as any).UnityLoader;
    this.gameInstance = loader.instantiate(
      'gameContainer',
      '/assets/AssetBundle_3DModelViewer/Build/AssetBundle_3DModelViewer.json', {
      onProgress: (gameInstance: any, progress: number) => {
        if (!gameInstance.Module) {
          return;
        }
        // const loader = document.querySelector<HTMLElement>("#loader");
        // if (!gameInstance.progress) {
        // const progress = document.querySelector<HTMLElement>("#loader .progress");
        // progress.style.display = "block";
        // gameInstance.progress = progress.querySelector(".full");
        // loader.querySelector<HTMLElement>(".spinner").style.display = "none";
        // }
        // gameInstance.progress.style.transform = `scaleX(${progress})`;
        // if (progress === 1 && !gameInstance.removeTimeout) {
        //   gameInstance.removeTimeout = setTimeout(function () {
        //     loader.style.display = "none";
        //   }, 2000);
        // }
        // this.spinner.hide();
        // this.progress = progress;
        // if (progress === 1) {
        //   this.isReady = true;
        // }
      }, Module: {
        cacheControl: { "default": "immutable" },
      }
    })
  }

  ngOnDestroy(): void {
    if (this.gameInstance) {
      this.gameInstance.Quit();
    }
  }

}
