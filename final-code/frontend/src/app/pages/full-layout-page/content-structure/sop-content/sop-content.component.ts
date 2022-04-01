import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  DoCheck,
  Renderer2,
  HostListener
} from '@angular/core';
// import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { AdminService } from '../../admin-services/admin-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ckEditorConfig } from '../../../../shared/config/ckeditor';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { demoData, TreeNode, DropInfo } from "../../../../../data";


declare var require: any;

const data: any = require('../../../../shared/data/chartist.json'); //../../shared/data/chartist.json

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}
@Component({
  selector: 'app-sop-content',
  templateUrl: './sop-content.component.html',
  styleUrls: ['./sop-content.component.scss']
})
export class SopContentComponent implements OnInit, DoCheck {
  @ViewChild('contentsearch', { static: false }) searchElement: ElementRef;
  @ViewChild('contentsearch1', { static: false }) searchElement1: ElementRef;
  @ViewChild('contentsearch2', { static: false }) searchElement2: ElementRef;
  @ViewChild('imhere') imhere: ElementRef;
  // @HostListener("click", ["$event"])
  imageE1: HTMLImageElement;
  addChapterBtn: HTMLElement;
  addChapterForm: FormGroup;
  addContentForm: FormGroup;
  formSubmitted: boolean;
  contentSubmitted: boolean;
  imageURL: string;
  chapters: Array<object>;
  showCreateChapterForm: boolean;
  imageContentSrc: string;
  contentFormData: object;
  ckEditorConfig: object;
  glossary: string;
  frameIsReady: boolean;
  imageDataURI: string;
  pointerEvents: string;
  isEdit:boolean;
  disableTextbox: Boolean;
  public personaldetails = [];
  contentImageUploadPath: string;
  ISubscriptions: Subscription[];
  public todo = [];
   done : any[];
   parentId : any;

  public todo1 = [];
  public done1 = [];

  public todo2 = [];
  public done2 = [];

  contentResult : any [];
  


  title = 'newMat';
    
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  private apiurl = "http://jsonplaceholder.typicode.com/users";
  contentRes: any[];
  searchValue_data: string;
  start: number;
  end: number;
  pageLimit: number;
  isAdmin: boolean;
  contentType: any;
  filterList: any;
  contentStatusList: any;
  filterContentStatus: any;
  preview: string
  preview1: any;
  preview2: any;
  planMappedData: any[];
  doCheckMappedData: any[];
  checkAndActMappedData: any[];
  selectedFilterType: any;
  contentId: any;
  getContentForUpdate: any[];
  getContentForUpdate1: any[];
  getContentForUpdate2: any[];

  nodes: TreeNode[] = [];
  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;
  hideArrangeBlock: boolean;
  sopImage = ''
  autoLoading: boolean;
  setInterval:any;
  onNextlick: boolean;
  count: number;

  /**
   * On constructor to get encrypted tenant data in URL to store local sorage.
   */
  constructor(
    private location: Location,
    private modalService: NgbModal,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    if (
      localStorage.loginInfonetApp === undefined ||
      localStorage.UserInfo === undefined
    ) {
      this.router.navigate(['./login']);
    }

    this.chapters = [];
    this.formSubmitted = false;
    this.contentSubmitted = false;
    this.disableTextbox = false;
    this.showCreateChapterForm = false;
    this.imageContentSrc = '';
    this.contentFormData = {};
    this.ckEditorConfig = ckEditorConfig.baseConfig;
    this.glossary = '';
    this.frameIsReady = false;
    this.imageDataURI = '';
    this.contentImageUploadPath = '';
    this.pointerEvents = 'pointer-events:all;';
    this.ISubscriptions = [];
    this.done = [];
    this.selectedFilterType = [];
    this.contentResult = [];
    this.getContentForUpdate = [];
    this.getContentForUpdate1 = [];
    this.getContentForUpdate2 = [];
    this.preview = '';
    this.preview1 = '';
    this.preview2 = '';
    this.count = 0;


    this.addContentForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      contentImage: [''],
      language: ['English', Validators.required],
      uploadImage: ['', Validators.required]
    });

    this.isAdmin = false;
    this.pageLimit = 100;
    this.start = 0;
    this.end = this.pageLimit;
    this.contentType = ["HTML", "Imported HTML", "Video"]
    this.filterList = this.contentType;

    this.contentStatusList = ["active"]
    this.filterContentStatus = this.contentStatusList;
    this.contentRes = [];
    this.parentId = '';
    this.autoLoading = false;

  }

  /**
   * On ngOnInit method to remove predefined data in local storage.
   */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      this.contentId = params.contentId;
    });

        /**EDIT STARTS */
        if (this.contentId) {
          this.isEdit=true;
          let editDataObj = {};
          // editDataObj['type'] = "Image";
          editDataObj['id'] = this.contentId;
          this.adminService.getSOPContentsById(editDataObj).subscribe(response => {
            this.getContentForUpdate = response['data']['stepPlan'];
            this.getContentForUpdate1 = response['data']['stepDoCheck'];
            this.getContentForUpdate2 = response['data']['stepDoAct'];
            if(Object.keys(response['data']).length ) {
              // console.log("response['data']", response['data'])
              this.addContentForm.get('title').setValue(response['data']['title'])
              this.addContentForm.get('description').setValue(response['data']['description'])
              this.addContentForm.get('language').setValue(response['data']['language'])
              this.addContentForm.get('uploadImage').setValue(response['data']['imagePath'].substring(response['data']['imagePath'].indexOf('_') + 1));   
              this.contentImageUploadPath = response['data']['imagePath'];
            }
            this.getContents(contentObj);
          }, error => {
            console.log(error)
            this.toastr.error('Invalid Content', 'Invalid Content');
          });
     
        }
        let contentObj = {
          start: this.start,
          end: this.pageLimit,
          searchFlg: false,
          search_scroll: false,
          filter_type: this.filterList,
          filter_status: this.filterContentStatus
        };
        let adminLocalStore = JSON.parse(localStorage.UserInfo).userdetails;
        if (adminLocalStore && adminLocalStore.role && adminLocalStore.role == "Admin") {
          this.isAdmin = true;
        }
        this.getContents(contentObj);
        /**EDIT ENDS */

        this.getData().subscribe((data) => {
          this.personaldetails = Array.from(Object.keys(data), k=>data[k]);
       });
      if(!this.contentId)
       this.contentSave();
  }

  contentSave() {
    let _this = this;

    this.setInterval=setInterval(function () {
    _this.autoSave();
   }, 20000);
}

autoSave(finalSubmit = false) {
  this.autoLoading = true;
  if(finalSubmit == false) {
    if((this.addContentForm.value.description) && (this.addContentForm.value.language) && (this.contentImageUploadPath) && (this.addContentForm.value.title)) {
      let data = { description: this.addContentForm.value.description,
        language: this.addContentForm.value.language,
        imagePath: this.contentImageUploadPath,
        contentType: 'sop',
        status:"draft",
        title: this.addContentForm.value.title,}
      // if (data.hasOwnProperty('contentImage') && data.hasOwnProperty('uploadImage')) {
      //   delete data['contentImage'];
      //   delete data['uploadImage'];
      // }
      // data['maxAllowedVersions'] = 4;
      // if (localStorage.checkItem('htmlContentId') === true) {
      //   data['htmlContentId'] = localStorage.getItem('htmlContentId');
      // }
          this.autoLoading = true;
          this.saveSopObj(data);
    }
  }

}

saveSopObj(data) {
  let saveSopContent = this.adminService.saveSOPContent(data).subscribe(response => {
    console.log(response);
    if (response && response['id']) {
      localStorage.setItem('htmlContentId', response['id']);
    }
    this.toastr.success('SOP content auto saved successfully', '');
    this.autoLoading = false;
  })
  this.ISubscriptions.push(saveSopContent);
}

    /**
   * @memberof SopContentComponent
   * Returns all types of contents for Listing purpose
  */
     getContents(contentObj) {
       if(!this.contentId){
        if (contentObj.searchFlg && contentObj.search_scroll) {
          this.contentRes = [];
        }
        this.adminService.getContents(contentObj).subscribe((result: any) => {
          this.todo = result.data;
        });
       } else {
        if (contentObj.searchFlg && contentObj.search_scroll) {
          this.contentRes = [];
        }
        this.adminService.getContents(contentObj).subscribe((result: any) => {
          this.todo = result.data;
          this.done = this.todo.filter(contentId => this.getContentForUpdate.find(({_id})=> contentId._id === _id))
          // this.todo = [];
          this.todo = this.todo.filter(contentId => !this.getContentForUpdate.find(({_id})=> contentId._id === _id))
        });
       }
    }

  ngDoCheck() {
    if(this.imageE1 == undefined){
      this.imageE1 = <HTMLImageElement><unknown>document.getElementsByTagName('image')[0];
    }
  }

  getData() {
    return this.http.get(this.apiurl);
 }


  get addChapterFormData(): any {
    return this.addChapterForm.controls;
  }

  get addContentFormData(): any {
    return this.addContentForm.controls;
  }


    /**
 * @return {*}  {void}
 * @memberof SopContentComponent
 * Upload SOP Content Image
*/
uploadFile(event): void {
  if (event.target.files.length > 0) {
    let file = event.target.files[0];
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!acceptedImageTypes.includes(file.type)) {
      this.toastr.error('Only Image files are allowed to upload.', '');
      return;
    }
    this.pointerEvents = 'pointer-events:none;';
    console.log(file)
    let UploadFileBehaviour =this.adminService.uploadSopImage(file).subscribe(response => {
      this.contentImageUploadPath = response['data'];
      this.addContentForm.controls.uploadImage.setValue(response['data'].substring(response['data'].indexOf('_') + 1));
      this.pointerEvents = 'pointer-events:all;';
      console.log(this.contentImageUploadPath);
      this.toastr.success('SOP image uploaded successfully', '');
    }, error => {
      this.toastr.error(error.error.error, '');
    });
    this.ISubscriptions.push(UploadFileBehaviour);
  }
}

  createNewContent(): void {
    this.contentSubmitted = true;
    if (this.addContentForm.invalid) {
      return;
    }
    let finalSubmit = true
    this.autoSave(finalSubmit);

    this.contentFormData = this.addContentForm.value;
    this.showCreateChapterForm = true;
  }

drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
  }
}

Preview(item) {
  console.log("Index Item :" , item )
  this.preview = item;
}


onNext() {

  if(!this.contentId){
    localStorage.setItem('planData', JSON.stringify(this.done));

    let contentObj = {
      start: this.start,
      end: this.pageLimit,
      searchFlg: false,
      search_scroll: false,
      filter_type: this.filterList,
      filter_status: this.filterContentStatus
    };
  
    this.adminService.getContents(contentObj).subscribe((result: any) => {
      console.log(result.data)
      this.todo1 = result.data;
    });
  } else {
    localStorage.setItem('planData', JSON.stringify(this.done));

    let contentObj = {
      start: this.start,
      end: this.pageLimit,
      searchFlg: false,
      search_scroll: false,
      filter_type: this.filterList,
      filter_status: this.filterContentStatus
    };
  
    this.adminService.getContents(contentObj).subscribe((result: any) => {
      console.log(result.data)
      this.todo1 = result.data;
      this.done1 = this.todo1.filter(contentId => this.getContentForUpdate1.find(({_id})=> contentId._id === _id))
      // this.todo = [];
      this.todo1 = this.todo1.filter(contentId => !this.getContentForUpdate1.find(({_id})=> contentId._id === _id))
    });
  }

}

drop1(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
  }
}

Preview1(item) {
  this.preview1 = item;
}

onNext1() {
  if(!this.contentId){
    localStorage.setItem('doCheckData', JSON.stringify(this.done1));
    let contentObj = {
      start: this.start,
      end: this.pageLimit,
      searchFlg: false,
      search_scroll: false,
      filter_type: this.filterList,
      filter_status: this.filterContentStatus
    };
  
    this.adminService.getContents(contentObj).subscribe((result: any) => {
      console.log(result.data)
      this.todo2 = result.data;
    }); 
  } else {
    localStorage.setItem('doCheckData', JSON.stringify(this.done1));
    let contentObj = {
      start: this.start,
      end: this.pageLimit,
      searchFlg: false,
      search_scroll: false,
      filter_type: this.filterList,
      filter_status: this.filterContentStatus
    };
  
    this.adminService.getContents(contentObj).subscribe((result: any) => {
      console.log(result.data)
      this.todo2 = result.data;
      this.done2 = this.todo2.filter(contentId => this.getContentForUpdate2.find(({_id})=> contentId._id === _id))
      // this.todo = [];
      this.todo2 = this.todo2.filter(contentId => !this.getContentForUpdate2.find(({_id})=> contentId._id === _id))
    }); 
  }

}

drop2(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
  }
}

Preview2(item) {
  this.preview2 = item;
}


Back() {
  this.showCreateChapterForm =! this.showCreateChapterForm;
}

submit(){
  // if(!this.contentId) {
  //   let _this = this;
  //   const Plan = JSON.parse(localStorage.getItem('planData'))
  //   const doCheck = JSON.parse(localStorage.getItem('doCheckData'))
  //   // console.log(doCheck)
  //   // console.log(this.done2)
  //   this.planMappedData= (Plan.map(({_id, type}) => ({_id, type}))) ;
  //   this.doCheckMappedData= (doCheck.map(({_id, type}) => ({_id, type}))) ;
  //   this.checkAndActMappedData= (this.done2.map(({_id, type}) => ({_id, type}))) ;
  //   const obj = {
  //     title: this.addContentForm.value.title,
  //     contentType: 'sop',
  //     imagePath: this.contentImageUploadPath,
  //     description: this.addContentForm.value.description,
  //     language: this.addContentForm.value.language,
  //     stepPlan: this.planMappedData,
  //     stepDoCheck: this.doCheckMappedData,
  //     stepDoAct: this.checkAndActMappedData
  //   }
  //   let saveSopContent = this.adminService.saveSOPContent(obj).subscribe(response => {
  //   })
  //   this.toastr.success('SOP Content saved successfully', '');
  //   _this.router.navigate(['/content-structure']);
  // } else {
    let _this = this;
    const Plan = JSON.parse(localStorage.getItem('planData'))
    const doCheck = JSON.parse(localStorage.getItem('doCheckData'))
    this.planMappedData= (Plan.map(({_id, type}) => ({_id, type}))) ;
    this.doCheckMappedData= (doCheck.map(({_id, type}) => ({_id, type}))) ;
    this.checkAndActMappedData= (this.done2.map(({_id, type}) => ({_id, type}))) ;
    const obj = {
      contentId: this.contentId,
      title: this.addContentForm.value.title,
      contentType: 'sop',
      status:"active",
      imagePath: this.contentImageUploadPath,
      description: this.addContentForm.value.description,
      language: this.addContentForm.value.language,
      stepPlan: this.planMappedData,
      stepDoCheck: this.doCheckMappedData,
      stepDoAct: this.checkAndActMappedData
    }
    let saveSopContent = this.adminService.updateSOPContent(obj).subscribe(response => {
    })
    this.toastr.success('SOP Content updated successfully', '');
    _this.router.navigate(['/content-structure']);
  // }
}

onSearchChange(searchValue: string):void {
  console.log(searchValue);
  // this.disableTextbox = true;
  this.searchValue_data = searchValue;
  this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterList.length) ? this.filterList : [];
  this.start = 0;
  this.end = this.pageLimit;
  const contentObj = {
    start: this.start,
    end: this.end,
    searchFlg: true,
    searchValue: searchValue,
    search_scroll: true,
    filter_type: this.selectedFilterType,
    filter_status: this.filterContentStatus
  };
  this.getContents(contentObj);
}

onSearchChange1(searchValue: string):void {
  this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterList.length) ? this.filterList : [];
  this.start = 0;
  this.end = this.pageLimit;
  let contentObj = {
    start: this.start,
    end: this.end,
    searchFlg: true,
    searchValue: searchValue,
    search_scroll: true,
    filter_type: this.selectedFilterType,
    filter_status: this.filterContentStatus
  };

  this.adminService.getContents(contentObj).subscribe((result: any) => {
    this.todo1 = result.data;
  });  
}

onSearchChange2(searchValue: string):void {
  this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterList.length) ? this.filterList : [];
  this.start = 0;
  this.end = this.pageLimit;
  let contentObj = {
    start: this.start,
    end: this.end,
    searchFlg: true,
    searchValue: searchValue,
    search_scroll: true,
    filter_type: this.selectedFilterType,  
    filter_status: this.filterContentStatus
  };

  this.adminService.getContents(contentObj).subscribe((result: any) => {
    this.todo2 = result.data;
  });  
}




ngOnDestroy() {
  const contentIdValue = localStorage.getItem('htmlContentId')
  if (contentIdValue) localStorage.removeItem('htmlContentId');
  for (let index in this.ISubscriptions) {
    let Subscription = this.ISubscriptions[index];
    if (Subscription) Subscription.unsubscribe();
  }
  if (this.setInterval) {
    clearInterval(this.setInterval);
  }
}

}

