import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../admin-services/admin-services.service';
import { FormGroup, FormBuilder, Validators, FormControl, Form, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from "environments/environment";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-content-structure',
  templateUrl: './content-structure.component.html',
  styleUrls: ['./content-structure.component.scss']
})
export class ContentStructureComponent implements OnInit {
  @ViewChild('contentsearch', { static: false }) searchElement: ElementRef;
  taskbarView: boolean;
  contentType: any;
  filterList: any;
  contentRes: Array<object>;
  order: string;
  reverse: boolean;
  sno: number;
  disableTextbox: boolean;
  searchValue_data: string;
  start: number;
  end: number;
  pageLimit: number;
  scrollDistance: number;
  scrollUpDistance: number;
  throttle: number;
  selectedFilterType: any;
  selectedFilterStatus: any;
  //filterByStatus: string;
  isAdmin: boolean;
  contentStatusList: any;
  filterContentStatus: any;
  versionList: any;
  versionCreatedAt: any;
  selectedVersion: string;
  selectedHtmlContentId: string;
  previewPath: any;
  public deleteContentForm: FormGroup;
  contentId: any;

  constructor(private adminService: AdminService, private modalService: NgbModal, private router: Router, private formBuilder: FormBuilder,
    private toastr: ToastrService, private domSanitizer: DomSanitizer,) {
      this.taskbarView = true;
      this.contentType = ["sop", "training"]
      this.filterList = this.contentType;
  
      this.contentStatusList = ["active", "inactive"]
      this.filterContentStatus = this.contentStatusList;
      this.contentRes = [];
      this.order = "createdAt"
      this.reverse = true;
      this.sno = 1;
      this.disableTextbox = false;
      this.searchValue_data = '';
      this.pageLimit = 20;
      this.start = 0;
      this.end = this.pageLimit;
      this.scrollDistance = 1;
      this.scrollUpDistance = 2;
      this.throttle = 300;
      this.selectedFilterType = [];
      this.selectedFilterStatus = [];
      //this.filterByStatus = 'active';
      this.isAdmin = false;
      this.deleteContentForm = this.formBuilder.group({
        contentId: new FormControl('', Validators.required),
        // contentType: new FormControl('', Validators.required),
        // path: new FormControl(''),
      })
      this.versionList = []
      this.versionCreatedAt = [];
      this.selectedVersion = ''
      this.selectedHtmlContentId = ''; 
      this.previewPath = ''
     }

  ngOnInit(): void {
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
  }

    /**
   * @return {*}  {void}
   * @memberof ContentStructureComponent
   * Switch list/grid view
  */
     contentView(viewmode: string): void {
      if (viewmode == 'grid') {
        this.taskbarView = true;
      } else {
        this.taskbarView = false;
      }
    }

  /**
  * @return {*}  {void}
  * @memberof ContentStructureComponent
  * Open Intermediate Page
  */
   openIntermdiatePage(content): void {
    this.modalService.open(content, {
      backdrop: 'static', size: 'md',
      keyboard: false,
      centered: true,
    });
  }

    /**
  * closeModal to use close the popup.
  * @memberof ContentStructureComponent
  * @param id
  */
     closeModal(id: string): void {
      this.modalService.dismissAll(id);
    }


    
  /**
  * @return {*}  {void}
  * @memberof ContentStructureComponent
  * Sorting content in ascending/descending
  */
  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  /**
 * onSearchChange method to get content data in db based on searched data.
 * @memberof ContentStructureComponent
 * @param searchValue
 */
   onSearchChange(searchValue: string): void {
    // this.disableTextbox = true;
    this.searchValue_data = searchValue;
    console.log(this.searchValue_data)
    this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterList.length) ? this.filterList : [];
    // this.selectedFilterStatus = (this.selectedFilterStatus.length) ? this.selectedFilterStatus : (this.contentStatusList.length) ? this.contentStatusList : [];
    this.start = 0;
    this.end = this.pageLimit;
    const contentObj = {
      start: this.start,
      end: this.end,
      searchFlg: true,
      searchValue: this.searchValue_data,
      search_scroll: true,
      filter_type: this.selectedFilterType,
      filter_status: this.selectedFilterStatus
    };
    this.getContents(contentObj);
  }

  /**
  * @memberof ContentStructureComponent
  * onScrollDown method to get content data based on mouse scorll down.
  * contentObj Its contain start and end count of data based on scorll down.<br>
  * On every scorll down method to increase the end count to this.pageLimit
  */
  onScrollDown() {
    this.start = this.end;
    this.end = this.end + this.pageLimit;
    this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterList.length) ? this.filterList : [];
    this.selectedFilterStatus = (this.selectedFilterStatus.length) ? this.selectedFilterStatus : (this.contentStatusList.length) ? this.contentStatusList : [];
    let contentObj = {};
    if (this.searchValue_data != '') {
      contentObj = {
        start: this.start,
        end: this.pageLimit,
        searchFlg: true,
        searchValue: this.searchValue_data,
        search_scroll: false,
        filter_type: this.selectedFilterType,
        filter_status: this.selectedFilterStatus
      };
    } else {
      contentObj = {
        start: this.start,
        end: this.pageLimit,
        searchFlg: false,
        search_scroll: false,
        filter_type: this.selectedFilterType,
        filter_status: this.selectedFilterStatus
      };
    }
    this.getContents(contentObj);
  }

  /**
   * @memberof ContentStructureComponent
   * Returns all types of contents for Listing purpose
  */
  getContents(contentObj) {
    if (contentObj.searchFlg && contentObj.search_scroll) {
      this.contentRes = [];
    }
    this.adminService.getSOPContents(contentObj).subscribe((result: any) => {
      console.log(result.data)
      this.contentRes = result.data
      // if (result.data) {
      //   this.contentRes = [...this.contentRes, ...result.data];
      // }
      // if (contentObj.searchFlg && contentObj.search_scroll) {
      //   if (this.contentRes.length === 0) {
      //     this.contentRes = [];
      //   }
      // }
      // this.disableTextbox = false;
      // setTimeout(() => {
      //   /** this will make the execution after the above boolean has changed**/
      //   this.searchElement.nativeElement.focus();
      // }, 0);
    });
  }

  /**
   * @memberof ContentStructureComponent
   * Filter By Content Type
  */
  filter(selectedType): void {
    this.selectedFilterType = (selectedType.length) ? selectedType : (this.filterList.length) ? this.filterList : [];
    this.selectedFilterStatus = (this.selectedFilterStatus.length) ? this.selectedFilterStatus : (this.contentStatusList.length) ? this.contentStatusList : [];
    this.disableTextbox = true;
    this.start = 0;
    this.end = this.pageLimit;
    const contentObj = {
      start: this.start,
      end: this.end,
      searchFlg: true,
      searchValue: this.searchValue_data,
      search_scroll: true,
      filter_type: this.selectedFilterType,
      filter_status: this.selectedFilterStatus
    };
    this.getContents(contentObj);
  }

  /**
   * @memberof ContentStructureComponent
   * Filter By Status [Access to EVX Admin Only]
  */
  filterContentsByStatus(selectedStatus) {
    this.selectedFilterStatus = (selectedStatus.length) ? selectedStatus : (this.contentStatusList.length) ? this.contentStatusList : [];
    this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterList.length) ? this.filterList : [];
    this.disableTextbox = true;
    this.start = 0;
    this.end = this.pageLimit;
    const contentObj = {
      start: this.start,
      end: this.end,
      searchFlg: true,
      searchValue: this.searchValue_data,
      search_scroll: true,
      filter_type: this.selectedFilterType,
      filter_status: this.selectedFilterStatus
    };
    if (selectedStatus.length == 0) this.filterContentStatus = this.contentStatusList;
    this.getContents(contentObj);
  }

  /**
   * @memberof ContentStructureComponent
   * Content Deletion popup used in content listing page
  */
  contentDelete(modal, content: string): void {
    this.deleteContentForm.controls.contentId.setValue(content['_id'])
    // this.deleteContentForm.controls.contentType.setValue(content['type'])  
    // if (content['type'] === "Video") this.deleteContentForm.controls.path.setValue(content['path'])
    this.modalService.open(modal, { backdrop: 'static', size: 'sm', keyboard: false, centered: true });
    console.log(this.deleteContentForm.value.contentId);
  }

  /**
   * @memberof ContentStructureComponent
   * Service call - Delete contents in listing page
  */
  deleteContentFormSubmit(): any {
    // if (this.deleteContentForm.invalid) {
    //   return;
    // }
    let data = {};
    data['id'] = this.deleteContentForm.value.contentId;
    console.log(data);
    // data['type'] = this.deleteContentForm.value.contentType;
    // if (this.deleteContentForm.value.contentType === "Video") data['videoPath'] = this.deleteContentForm.value.path;
    this.adminService.deleteSOPContent(data).subscribe((response: any) => {
      this.contentRes = this.contentRes.filter(function (obj) {
        return obj['_id'] !== data['id'];
      });
      this.modalService.dismissAll();
      this.toastr.success(response['message'])
    }, (error) => {
      this.toastr.error(error.error, '');
    });
  }

  /**
   * @memberof ContentStructureComponent
   * Content Edit page call
  */
  contentEdit(versionEditPopup, content): void {
    this.selectedVersion = ''
    this.contentId = content['_id']
    console.log(this.contentId);
    // let contentType = content['type']
    let path
    const obj = {
      contentId:this.contentId
    }
      // this.modalService.open(versionEditPopup, {
      //   backdrop: 'static', size: 'md',
      //   keyboard: false,
      //   centered: true,
      // });
    path = '/sop-content';
    this.router.navigate([path + '/edit/'],{ queryParams: obj });
  }

  /**
   * @return {*}  {void}
   * @memberof ContentStructureComponent
   * Edit Versioning
   */
  // versionEdit() {
  //   this.closeModal('versionEditPopup');
  //   let path = '/html-content';
  //   this.router.navigate([path + '/edit/' + this.selectedHtmlContentId + '/' + this.selectedVersion]);
  // }

  /**
   * @return {*}  {void}
   * @memberof ContentStructureComponent
   * Preview the created HTML Content
   */
  preview(contentpreview: any, content: any): void {
    let templatePath = environment.apiURL + 'evx_template/pages/text_image.html?mode=preview&id=' + content._id + '&type=' + content.type;
    this.previewPath = this.domSanitizer.bypassSecurityTrustResourceUrl(templatePath)
    this.modalService.open(contentpreview, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
      centered: true,
    });
  }

}
