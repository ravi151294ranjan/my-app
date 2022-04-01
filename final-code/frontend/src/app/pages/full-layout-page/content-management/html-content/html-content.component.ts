/**
 * Author: Dhanabalan.cs
 * Class : HtmlContentComponent
 * Purpose: Create HTML content.
 * This is the child component under Content management
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ckEditorConfig } from '../../../../shared/config/ckeditor';
import { AdminService } from '../../admin-services/admin-services.service';
import { CommonHelper } from '../../../../shared/helpers/common.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from "environments/environment";
import { LocalStore } from '../../../../shared/services/local-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-html-content',
  templateUrl: './html-content.component.html',
  styleUrls: ['./html-content.component.scss', '../../content-management/content-management.component.scss']
})

export class HtmlContentComponent implements OnInit, OnDestroy {
  contentHtmlForm: FormGroup;
  languageList: Array<string>;
  config: object;
  defaultLanguage: string;
  previewData: object;
  showSecondStepForm: boolean;
  isEdit: boolean;
  pointerEvents: string;
  contentImageUploadPath: string;
  isNextBtnEnable: boolean;
  currentVersion: string;
  selectedVersion: string;
  autoLoading: boolean;
  ISubscriptions: Subscription[];
  setInterval:any;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private modalService: NgbModal,
    private commonHelper: CommonHelper, private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer) {
    this.showSecondStepForm = false;
    this.config = ckEditorConfig.baseConfig;
    this.previewData = {};
    this.languageList = [];
    this.defaultLanguage = '';
    this.isEdit = false;
    this.pointerEvents = 'pointer-events:all;';
    this.contentImageUploadPath = '';
    this.isNextBtnEnable = false; //Disable Next Button
    this.currentVersion = '';
    this.selectedVersion = '';
    this.autoLoading = false;
    this.ISubscriptions = [];
    this.setInterval='';
    if (LocalStore.checkItem('htmlFormStep') === false) {
      LocalStore.setItem('htmlFormStep', 1);
    }
  }

  ngOnInit(): void {
    this.adminService.getLanguages().subscribe(response => {
      if (response && response['data']) this.languageList = response['data'];
      let matchedLang = response['data'].find((langItem) => {
        if (langItem.is_default === true) return true;
      });
      if (matchedLang) {
        this.defaultLanguage = matchedLang['name'];
        this.contentHtmlForm.patchValue({
          language: this.defaultLanguage
        });
      }
    }, error => {
      this.toastr.error(error.error.error, '');
    });
    this.defaultLanguage = "English"
    this.contentHtmlForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      language: [''],
      content: ['', [Validators.required]],
      glossary: ['', [Validators.required]],
      contentImage: [''],
      uploadImage: ['', Validators.required],
    });
    /**EDIT STARTS */
    if (this.activatedRoute.snapshot.params.id && this.activatedRoute.snapshot.params.versionId) {
      this.isEdit = true;
      let editDataObj = {};
      editDataObj['type'] = "HTML";
      editDataObj['id'] = this.activatedRoute.snapshot.params.id;
      editDataObj['versionId'] = this.activatedRoute.snapshot.params.versionId;
      let EditBehaviour = this.adminService.getHtmlContentById(editDataObj).subscribe(response => {
        if (Object.keys(response['data']).length) {
          if (LocalStore.checkItem('htmlContentId') === false) {
            LocalStore.setItem('htmlContentId', this.activatedRoute.snapshot.params.id);
          }
          this.selectedVersion = (response['data']['versionId']) ? response['data']['versionId'] : ''
          this.contentHtmlForm.get('title').setValue(response['data']['title'])
          this.contentHtmlForm.get('description').setValue(response['data']['description'])
          this.contentHtmlForm.get('language').setValue(response['data']['language'])
          this.contentHtmlForm.get('content').setValue(response['data']['content'])
          this.contentHtmlForm.get('glossary').setValue(response['data']['glossary'])
          this.contentHtmlForm.controls.uploadImage.setValue(response['data']['path'].substring(response['data']['path'].indexOf('_') + 1));
          this.contentImageUploadPath = response['data']['path'];
        }
        this.onValidateStep1();
      }, error => {
        this.toastr.error('Invalid Content', 'Invalid Content');
      });
      this.ISubscriptions.push(EditBehaviour);
     
    }

    /**EDIT ENDS */

    this.contentSave();
  }

  contentSave() {
      let _this = this;
      this.setInterval=setInterval(function () {
      _this.autoSave();
     }, 10000);
  }

  autoSave(finalSubmit = false) {
    let stepno = JSON.parse(JSON.stringify(LocalStore.getItem('htmlFormStep')));
    let data = { ...this.contentHtmlForm.value, path: this.contentImageUploadPath }
    if (data.hasOwnProperty('contentImage') && data.hasOwnProperty('uploadImage')) {
      delete data['contentImage'];
      delete data['uploadImage'];
    }
    data['maxAllowedVersions'] = 4;
    if (LocalStore.checkItem('htmlContentId') === true) {
      data['htmlContentId'] = LocalStore.getItem('htmlContentId');
    }
    if (stepno == '1') {
      if (this.isNextBtnEnable === true) {
        this.currentVersion = 'draft';
        this.autoLoading = true;
        this.saveHtmlObj(data);
      }
    }
    if (stepno == '2') {
      this.autoLoading = true;
      if (finalSubmit === true) {
        data['status'] = 'active';
        data['fullUpdate'] = 1;
      }
      this.saveHtmlObj(data);
    }
  }

  saveHtmlObj(data) {
    let stepno = JSON.parse(JSON.stringify(LocalStore.getItem('htmlFormStep')));
    let SavesBehaviour = this.adminService.saveHtmlContent(data).subscribe(response => {
      if (response && response['id']) {
        LocalStore.setItem('htmlContentId', response['id']);
      }
      if (data && data['fullUpdate'] == 1) {
        this.toastr.success('HTML content auto saved successfully', '');
      }
      this.autoLoading = false;
    }, error => {
      this.autoLoading = false;
      this.toastr.error(error.error.error, '');
    });
    this.ISubscriptions.push(SavesBehaviour);
  }

  /**
 * @readonly
 * @type {*}
 * @memberof HtmlContentComponent
 * This function enable or disable the Next Action button
 */
  onValidateStep1(): void {
    if (this.contentForm.title.value != "" && this.contentForm.description.value != "") {
      this.isNextBtnEnable = true;//ENABLE Next Button
    } else {
      this.isNextBtnEnable = false; //Disable Next Button
    }
  }
  /**
   * @readonly
   * @type {*}
   * @memberof HtmlContentComponent
   * contentForm is AliasName of contentHtmlForm 
   */
  get contentForm(): any {
    return this.contentHtmlForm.controls;
  }

  /**
   * @return {*}  {void}
   * @memberof HtmlContentComponent
   * HTML Content creation
   */
  onSubmit() {
    if (this.contentHtmlForm.invalid) { return; }
    let finalSubmit = true
    this.autoSave(finalSubmit);
    let _this = this;
    setTimeout(function(){
      _this.router.navigate(['/content']);
     }, 500);    
  }

  /**
 * @return {*}  {void}
 * @memberof HtmlContentComponent
 * Preview the created HTML Content
 */
  preview(content: any): void {
    this.previewData = this.contentHtmlForm.value;
    let contentType="HTML";
    let templatePath = environment.apiURL + 'evx_template/pages/text_image.html?mode=preview&id=' + this.activatedRoute.snapshot.params.id+'&type='+contentType;
    this.previewData['templatePath'] = this.domSanitizer.bypassSecurityTrustResourceUrl(templatePath)
    this.modalService.open(content, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
      centered: true,
    });
  }

  /**
   * closeModal to use close the popup.
   * @param id
   */
  closeModal(id: string): void {
    this.modalService.dismissAll(id);
  }

  /**
   * PARASE HTML Tag content to display in Preview Popup
   * @param value
  */
  sanitizeHTML(value): any {
    return this.commonHelper.sanitizeHTML(value);
  }

  /**
   * @return {*}  {void}
   * @memberof HtmlContentComponent
   * Update the spellchecker language based on the language selection in HTML authoring tool
  */
  ckeditorLangChange(): void {
    let selectedLang = this.contentHtmlForm.get('language').value;
    ckEditorConfig.baseConfig.scayt_sLang = this.commonHelper.setCKEditorSpellCheckerDefaultLang(selectedLang, this.languageList)
    this.config = ckEditorConfig.baseConfig;
  }

  /**
   * @return {*}  {void}
   * @memberof HtmlContentComponent
   * Next Option
  */
  next(): void {
    if (this.isNextBtnEnable === true) {
      //If Next Btn is enabled
      this.autoSave();
      LocalStore.setItem('htmlFormStep', 2);
      this.showSecondStepForm = true;
      this.ckeditorLangChange();
    }
  }

  /**
   * @return {*}  {void}
   * @memberof HtmlContentComponent
   * Back option
  */
  back(): void {
    LocalStore.setItem('htmlFormStep', 1);
    this.showSecondStepForm = false
  }

  /**
 * @return {*}  {void}
 * @memberof HtmlContentComponent
* Cancel option redirects to content listing page
*/
  cancel(): void {
    this.router.navigate(['/content']);
  }

  /**
 * @return {*}  {void}
 * @memberof HtmlContentComponent
 * Upload HTML Content Image
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
      let UploadFileBehaviour =this.adminService.uploadImage(file).subscribe(response => {
        this.contentImageUploadPath = response['data'];
        this.contentHtmlForm.controls.uploadImage.setValue(response['data'].substring(response['data'].indexOf('_') + 1));
        this.pointerEvents = 'pointer-events:all;';
        this.toastr.success('Content image uploaded successfully', '');
      }, error => {
        this.toastr.error(error.error.error, '');
      });
      this.ISubscriptions.push(UploadFileBehaviour);
    }
  }

  ngOnDestroy() {
    if (LocalStore.checkItem('htmlFormStep') === true) LocalStore.removeItem('htmlFormStep');
    if (LocalStore.checkItem('htmlContentId') === true) LocalStore.removeItem('htmlContentId');
    for (let index in this.ISubscriptions) {
      let Subscription = this.ISubscriptions[index];
      if (Subscription) Subscription.unsubscribe();
    }
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
  }
}