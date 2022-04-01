/**
 * Author: Dhanabalan.cs
 * Class : ImportedHtmlContentComponent
 * Purpose: Create Imported HTML content.
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
import { environment } from "environments/environment";
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStore } from '../../../../shared/services/local-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-imported-html-content',
  templateUrl: './imported-html-content.component.html',
  styleUrls: ['./imported-html-content.component.scss', '../../content-management/content-management.component.scss']
})

export class ImportedHtmlContentComponent implements OnInit, OnDestroy {
  contentHtmlForm: FormGroup;
  languageList: Array<string>;
  previewData: object;
  config: object;
  defaultLanguage: string;
  showSecondStepForm: boolean;
  pointerEvents: string;
  packageUploadPath: string;
  isEdit: boolean;
  isNextBtnEnable: boolean;
  setInterval: any;
  autoLoading: boolean;
  ISubscriptions: Subscription[];

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private modalService: NgbModal,
    private adminService: AdminService, private router: Router, private commonHelper: CommonHelper, private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer) {
    this.showSecondStepForm = false;
    this.config = ckEditorConfig.baseConfig;
    this.previewData = {};
    this.languageList = [];
    this.packageUploadPath = '';
    this.defaultLanguage = '';
    this.pointerEvents = 'pointer-events:all;';
    this.isNextBtnEnable = false; //Disable Next Button
    this.setInterval = '';
    this.ISubscriptions = [];
    this.autoLoading = false;
    if (LocalStore.checkItem('htmlPackageFormStep') === false) {
      LocalStore.setItem('htmlPackageFormStep', 1);
    }
  }

  ngOnInit(): void {
    let LanguageBehaviour = this.adminService.getLanguages().subscribe(response => {
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
    this.ISubscriptions.push(LanguageBehaviour);
    this.contentHtmlForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      language: [''],
      contentPackage: [''],
      htmlPackage: ['', Validators.required],
      glossary: ['', [Validators.required]],
    });

    /**EDIT STARTS */
    if (this.activatedRoute.snapshot.params.id) {
      this.isEdit = true;
      let editDataObj = {};
      editDataObj['type'] = "Imported HTML";
      editDataObj['id'] = this.activatedRoute.snapshot.params.id;
      let EditBehaviour = this.adminService.getContentById(editDataObj).subscribe(response => {
        if (Object.keys(response['data']).length) {
          if (LocalStore.checkItem('htmlPackageContentId') === false) {
            LocalStore.setItem('htmlPackageContentId', this.activatedRoute.snapshot.params.id);
          }
          this.contentHtmlForm.get('title').setValue(response['data']['title'])
          this.contentHtmlForm.get('description').setValue(response['data']['description'])
          this.contentHtmlForm.get('language').setValue(response['data']['language'])
          this.contentHtmlForm.get('glossary').setValue(response['data']['glossary'])
          this.contentHtmlForm.controls.htmlPackage.setValue(response['data']['path'].substring(response['data']['path'].indexOf('_') + 1));
          this.packageUploadPath = response['data']['path'];
          this.onValidateStep1();
        }
      }, error => {
        this.toastr.error('Invalid Content', 'Invalid Content');
      });
      this.ISubscriptions.push(EditBehaviour);
    }
    /**EDIT ENDS */
    this.contentSave();
  }

  /**
   * @readonly
   * @type {*}
   * @memberof ImportedHtmlContentComponent
   * contentForm is AliasName of contentHtmlForm 
   */
  get contentForm(): any {
    return this.contentHtmlForm.controls;
  }


  /**
   * @return {*}  {void}
   * @memberof ImportedHtmlContentComponent
   * Imported HTML Content creation
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
   * @memberof ImportedHtmlContentComponent
   * Upload HTML Package
  */
  uploadFile(event): void {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.type != 'text/html') {
        this.toastr.error('Only Html files are allowed to upload.', '');
        return;
      }
      this.pointerEvents = 'pointer-events:none;';
      this.adminService.uploadPackage(file).subscribe(response => {
        this.packageUploadPath = response['data'];
        this.contentHtmlForm.controls.htmlPackage.setValue(response['data'].substring(response['data'].indexOf('_') + 1));
        this.pointerEvents = 'pointer-events:all;';
        this.toastr.success('Html package uploaded successfully', '');
      }, error => {
        this.toastr.error(error.error.error, '');
      });
    }
  }

  /**
 * @return {*}  {void}
 * @memberof ImportedHtmlContentComponent
 * Preview the created HTML Content
 */
  preview(content: any): void {
    this.previewData = this.contentHtmlForm.value;
    this.packageUploadPath = 'https://evxdemo.sifylivewire.com/evx_template/pages/text_image.html?mode=preview&id=contentdetails';
    this.previewData['content'] = this.domSanitizer.bypassSecurityTrustResourceUrl(this.packageUploadPath)
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
   * @return {*}  {void}
   * @memberof ImportedHtmlContentComponent
   * Update the spellchecker language based on selected language in Imported html authoring tool
  */
  ckeditorLangChange(): void {
    let selectedLang = this.contentHtmlForm.get('language').value;
    ckEditorConfig.baseConfig.scayt_sLang = this.commonHelper.setCKEditorSpellCheckerDefaultLang(selectedLang, this.languageList)
    this.config = ckEditorConfig.baseConfig;
  }

  /**
   * @return {*}  {void}
   * @memberof ImportedHtmlContentComponent
   * Next Option
  */
  next(): void {
    if (this.isNextBtnEnable === true) {
      this.autoSave();
      LocalStore.setItem('htmlPackageFormStep', 2);
      this.ckeditorLangChange();
      this.showSecondStepForm = true
    }
  }

  /**
   * @return {*}  {void}
   * @memberof ImportedHtmlContentComponent
   * Back option
  */
  back(): void {
    LocalStore.setItem('htmlPackageFormStep', 1);
    this.showSecondStepForm = false;
  }

  /**
 * @return {*}  {void}
 * @memberof ImportedHtmlContentComponent
 * Cancel option redirects to content listing page
*/
  cancel(): void {
    this.router.navigate(['/content']);
  }
  /**
 * @readonly
 * @type {*}
 * @memberof ImportedHtmlContentComponent
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
* @memberof ImportedHtmlContentComponent
* Initiates auto save function
*/  
  contentSave() {
    let _this = this;
    this.setInterval = setInterval(function () {
      _this.autoSave();
    }, 10000);
  }
  
  /**
* @readonly
* @type {*}
* @memberof ImportedHtmlContentComponent
* Auto save function initiates every 10 sec to store data
*/  
  autoSave(finalSubmit = false) {
    let stepno = JSON.parse(JSON.stringify(LocalStore.getItem('htmlPackageFormStep')));
    let data = { ...this.contentHtmlForm.value, path: this.packageUploadPath }
    if (data.hasOwnProperty('contentPackage') && data.hasOwnProperty('htmlPackage')) {
      delete data['contentPackage'];
      delete data['htmlPackage'];
    }
    if (LocalStore.checkItem('htmlPackageContentId') === true) {
      data['htmlPackageContentId'] = LocalStore.getItem('htmlPackageContentId');
    }
    if (stepno == '1') {
      if (this.isNextBtnEnable === true) {
        this.autoLoading = true;
        this.saveHtmlPackageObj(data);
      }
    }
    if (stepno == '2') {
      this.autoLoading = true;
      if (finalSubmit === true) {
        data['status'] = 'active';
        data['fullUpdate'] = 1;
      }
      this.saveHtmlPackageObj(data);
    }    
  }

    /**
* @readonly
* @type {*}
* @memberof ImportedHtmlContentComponent
* This function is used to save HTML5 Data
*/
saveHtmlPackageObj(data) {
    let SavesBehaviour = this.adminService.saveImportedHtmlContent(data).subscribe(response => {
      if (response && response['id']) {
        LocalStore.setItem('htmlPackageContentId', response['id']);
      }
      if (data && data['fullUpdate'] == 1) {
        this.toastr.success('Imported HTML content updated successfully', '');
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
* @memberof ImportedHtmlContentComponent
* This is destructor to clear unused data from memory
*/
  ngOnDestroy() {
    if (LocalStore.checkItem('htmlPackageFormStep') === true) LocalStore.removeItem('htmlPackageFormStep');
    if (LocalStore.checkItem('htmlPackageContentId') === true) LocalStore.removeItem('htmlPackageContentId');
    for (let index in this.ISubscriptions) {
      let Subscription = this.ISubscriptions[index];
      if (Subscription) Subscription.unsubscribe();
    }
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
  }
}