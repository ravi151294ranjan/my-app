import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../admin-services/admin-services.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  Form,
} from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
// Declarations
declare var require: any;
const data: any = require('../../../shared/data/company.json');

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { RegisterService } from '../../content-layout-page/register/register.service';
import * as XLSX from 'xlsx';
import {RoleManagementComponent} from '../role-management/role-management.component'
@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.scss'],
})
export class UsermanageComponent implements OnInit {
  @ViewChild('usersearch', { static: false }) searchElement: ElementRef;
  @ViewChild(RoleManagementComponent) roleComponent;
  public addUserForm: FormGroup;
  public deleteUserForm: FormGroup;
  public buttonloading = false;
  userData = [];
  rows = [];
  p = 1;
  firstname;
  temp = [];
  closeResult;
  currentPage = 1;
  itemsPerPage = 5;
  public save_clicked: boolean;
  public update_clicked: boolean;
  PopupName: string;
  alertResult: any;
  index: number;
  userInfo: any;
  selectedItems = [];
  EditUserId;
  sortedCollection: any[];
  order = 'firstname';
  reverse = false;
  start_user = 0;
  end_user = 20;
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  searchValue_data = '';
  SearchData;
  taskbarView = true;
  datavalue = [];
  usercount;
  disableTextbox = false;
  butDisabled = true;
  newlyCreatedRole: Array<string>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  // evx
  roles: Array<any>;
  addRoleForm: FormGroup;
  public addRoleTriggered: boolean;
  filterRoleList: Array<any>;
  selectedFilterType:any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public registerService: RegisterService,
    private router: Router,
    private orderPipe: OrderPipe,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.newlyCreatedRole = [];
    this.save_clicked = false;
    this.roles = [];
    this.filterRoleList=[];
    this.selectedFilterType=[];
    this.addRoleTriggered = false;
    this.addUserForm = new FormGroup(
      {
        firstname: new FormControl('', Validators.required),
        lastname: new FormControl('', Validators.required),

        //email: new FormControl('', [Validators.required]),
        email: new FormControl('', [
          Validators.pattern(
            '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$'
          ),
          Validators.required,
        ]),
        mobile: new FormControl('', [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern('[0-9]*'),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePassword,
        ]),
        confirmPassword: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
      },
      this.checkPasswordMatch('password', 'confirmPassword')
    );

    this.addRoleForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
    });

    this.deleteUserForm = this.formBuilder.group({
      user: new FormControl('', Validators.required),
    })

    if (
      localStorage.loginInfonetApp === undefined ||
      localStorage.UserInfo === undefined
    ) {
      this.router.navigate(['./login']);
    }
    // this.location.replaceState('/pages/users');
  }

  /**
   *  On ngOnint method to call getAllGroups and getAllUserData methods.
   */
   ngOnInit() {
    this.userInfo = JSON.parse(localStorage.UserInfo).userdetails;
    this.adminService.GetRolesData().subscribe((result: Object) => {
      this.roles = result['data'];
      this.filterRoleList=this.roles;
      const userlimit = {
        start_user: this.start_user,
        end_user: 20,
        search_filter: false,
        Search_scorl: false,
        filterByRoleType:result['data'] 
      };
      this.getAllUserData(userlimit);
    });
    //this.getAllRolesData();
  }

  /**
   * validatePassword method used to validate password Strength.<br>
   * Password should containt atleast one capital letter<br>
   * Its contain atleast one special charecter<br>
   * Its contain atlease one number<br>
   * Its contain atleast one small letter.
   * @param controls {String}  password value
   * @return It return boolean value.
   */
  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
    );
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { validatePassword: true }; // Return as invalid password
    }
  }

  /**
   * checkPasswordMatch method used to verify actual password and confirm password is same or not.
   * @param pass Its contain the actual password.
   * @param confirmPass  Its contain confirm password.
   */
  checkPasswordMatch(pass: string, confirmPass: string): any {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[pass];
      const confirmPassword = formGroup.controls[confirmPass];

      // set error on matchingControl if validation fails
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }

  omit_special_char(event) {
    var k;
    k = event.keyCode;
    //k = event.charCode; (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 95 ||
      k == 8 ||
      k == 46 ||
      (k >= 48 && k <= 57)
    );
    //return k != 64
  }

  tenantEncryptData;
  tenantPreFix;
  /**
   * getAllUserData method to get all user list through this.adminService.GetAllUser service.
   * @param userlimit Its contain pagination start and end count.
   */
  getAllUserData(userlimit) {
    if (userlimit.search_filter && userlimit.Search_scorl) {
      this.userData = [];
    }
    this.adminService.GetAllUser(userlimit).subscribe((result: any) => {
      if (result.data.length > 0) {
        let UserData_val = result.data;
        UserData_val.forEach((element) => {
          this.userData.push(element);
        });
        this.userData.sort(function (a, b) {
          return a.firstname.localeCompare(b.firstname);
        });
        this.sortedCollection = this.orderPipe.transform(
          this.userData,
          'firstname'
        );
        // this.temp = [...result.data];
        this.rows = result.data;
 
      }
      if (userlimit.search_filter && userlimit.Search_scorl) {
        if (result.data.length == 0) {
          this.userData = [];
        }
      }

      this.disableTextbox = false;
      setTimeout(() => {
        // this will make the execution after the above boolean has changed
        this.searchElement.nativeElement.focus();
      }, 0);
    });
  }

  getAllRolesData() {
    this.adminService.GetRolesData().subscribe((result: Object) => {
      this.roles = result['data'];
      this.filterRoleList=this.roles;
    });
  }

  /**
   * onSearchChange method to get user data in db based on searched data.
   * @param searchValue Its contain user data
   */
  onSearchChange(searchValue: string): void {
    this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterRoleList.length) ? this.filterRoleList : [];
    this.disableTextbox = true;
    this.searchValue_data = searchValue;
    this.start_user = 0;
    this.end_user = 20;
    const userlimit = {
      start_user: this.start_user,
      end_user: 20,
      search_filter: true,
      searchValue: searchValue,
      Search_scorl: true,
      filterByRoleType: this.selectedFilterType,
    };
    this.getAllUserData(userlimit);
  }
  /**
   * onScrollDown method to get user data based on mouse scorll down.
   * userlimit Its contain start and end count of data based on scorll down.<br>
   * On every scorll down method to increase the end count to 20
   */
  onScrollDown() {
    this.selectedFilterType = (this.selectedFilterType.length) ? this.selectedFilterType : (this.filterRoleList.length) ? this.filterRoleList : [];
    this.start_user = this.end_user;
    this.end_user = this.end_user + 20;
    let userlimit = {};
    if (this.searchValue_data != '') {
      userlimit = {
        start_user: this.start_user,
        end_user: 20,
        search_filter: true,
        searchValue: this.searchValue_data,
        Search_scorl: false,
        filterByRoleType:this.selectedFilterType,
      };
    } else {
      userlimit = {
        start_user: this.start_user,
        end_user: 20,
        search_filter: false,
        Search_scorl: false,
        filterByRoleType:this.selectedFilterType,
      };
    }

    this.getAllUserData(userlimit);
  }

  /**
   * @memberof UsermanageComponent
   * Filter By Role Type
  */
   filterByRoleType(selectedType): void {
    this.selectedFilterType = (selectedType.length) ? selectedType : (this.filterRoleList.length) ? this.filterRoleList : [];
    this.disableTextbox = true;
    let userlimit = {
      start_user: 0,
      end_user: 20,
      search_filter: true,
      searchValue: this.searchValue_data,
      Search_scorl: true,
      filterByRoleType:this.selectedFilterType,
    };
    this.getAllUserData(userlimit);

  }

  // onUp(ev) {
  // }

  /**
   * open method to view the model popo up for add user process.
   * @param content Its contain the content of popup.
   * @param btn Its contain the function like add or edit.
   */

  open(content: any, btn: any) {
    this.PopupName = btn;
    this.save_clicked = false;

    switch (this.PopupName) {
      case 'Add':
        this.edituservalue = false;
        this.addUserForm.reset();
        this.update_clicked = false;
        // this.addUserForm.controls['password'].setValidators([Validators.required]);
        this.addUserForm.controls['confirmPassword'].setValidators([
          Validators.required,
        ]);
        this.addUserForm.controls['firstname'].setValue('');
        this.addUserForm.controls['lastname'].setValue('');
        this.addUserForm.controls['email'].setValue('');
        this.addUserForm.controls['mobile'].setValue('');
        this.addUserForm.controls['password'].setValue('');
        this.addUserForm.controls['confirmPassword'].setValue('');
        this.addUserForm.controls['role'].setValue('');
        this.addUserForm.controls['status'].setValue('Active');
        break;
      case 'addRole':
        this.addRoleForm.controls['name'].setValue('');
        this.modalService.open(content, {
          backdrop: 'static',
          keyboard: false,
          centered: true,
        });
        return;
        break;
      case 'UserRole':
        this.modalService.open(content, {
          size: 'xl',
          backdrop: 'static',
          keyboard: false,
          centered: true,
        });
        return;
        break;
      default:
        this.addUserForm.controls['password'].setValidators(null);
        this.addUserForm.controls['confirmPassword'].setValidators(null);
        this.addUserForm.controls['password'].setValue('');
        this.addUserForm.controls['confirmPassword'].setValue('');
        this.update_clicked = true;
        break;
    }

    this.modalService.open(content, { backdrop: 'static', keyboard: false });
    // this.modalService.open(content);
  }

  /**
   * EditUser method to edit the user details.
   * @param _data Its contain user details for edit.
   */
  edituservalue = false;
  EditUser(_data: any) {
    this.edituservalue = true;
    this.EditUserId = _data.email;
    this.index = this.userData.indexOf(_data);
    this.addUserForm.controls['firstname'].setValue(_data.firstname || '');
    this.addUserForm.controls['lastname'].setValue(_data.lastname || '');
    this.addUserForm.controls['email'].setValue(_data.email || '');
    this.addUserForm.controls['mobile'].setValue(_data.mobile || '');
    this.addUserForm.controls['role'].setValue(_data.role || '');
    this.addUserForm.controls['status'].setValue(_data.status || '');
  }

  /**
   * onFormSubmit method used to send data in service for Add and Edit process. <br>
   * If add process is happened its call this.adminService.CreateSingleUser  service. <br>
   * If Edit process is happened its called  this.adminService.UpdateSingleUser service.
   * @param add_data Its contain user data for Add and edit method.
   * @param isValid Its used to validate input box.
   */

  onFormSubmit(add_data: any, isValid: boolean) {
    this.buttonloading = false;
    this.save_clicked = true;

    if (!isValid) {
      return false;
    }
    if (this.PopupName === 'Add') {
      this.buttonloading = true;
      add_data['createdBy'] = this.userInfo._id;
      add_data['email'] = add_data.email.toLowerCase();
      this.adminService.CreateSingleUser(add_data).subscribe((result: any) => {
        if (result.success) {
          this.save_clicked = false;
          this.addUserForm.reset()
          this.modalService.dismissAll();
          this.toastr.success(result.message, '');
          this.userData = []
          let userlimit = {
            start_user: 0,
            end_user: 20,
            search_filter: true,
            Search_scorl: false,
            filterByRoleType:this.selectedFilterType,
            searchValue: this.searchValue_data,
          }
          this.buttonloading = false
          this.getAllUserData(userlimit)
        } else {
          this.buttonloading = false
          this.toastr.error(result.message, '');
        }
      });
    } else {
      this.buttonloading = true;
      add_data['email'] = this.EditUserId;
      add_data['updatedBy'] = this.userInfo._id;

      add_data['email'] = add_data.email.toLowerCase(); // + this.tenantPreFix

      if (add_data.password === '' || add_data.password === null) {
        delete add_data['password'];
        delete add_data['confirmPassword'];
      }
      this.adminService.UpdateSingleUser(add_data).then((result) => {
        if (result.success) {
          this.userData[this.index] = add_data;

          this.save_clicked = false;
          this.addUserForm.reset();
          this.modalService.dismissAll();
          this.toastr.success(result.message, '');
          this.userData = [];
          let userlimit = {
            start_user: 0,
            end_user: 20,
            search_filter: true,
            Search_scorl: false,
            filterByRoleType:this.selectedFilterType,
            searchValue: this.searchValue_data,
          };

          this.buttonloading = false;
          this.getAllUserData(userlimit);
        } else {
          this.buttonloading = false;
          this.toastr.error(result.message, '');
        }
      });
    }
  }

  /**
   * Its used validate enterd value is number or not.
   * @param event typed value in textbox
   */
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  /**
   * closeModal to use close the popup.
   * @param id
   */
  closeModal(id: string) {
    this.modalService.dismissAll(id);
  }

  /**
   * Used in multi drop down to view on selected item
   */
  onItemSelect(_data) {}
  /**
   * Used in multi drop down to select all item
   */
  onSelectAll(_data) {}
  /**
   * Used in multi drop down to delete select item
   */
  onItemDeSelect(_data) {}

  /**
   * setOrder method used to sort scenario data.
   */
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  /**
   * contentView to view data in list view or gird view
   * @param viewmode Its contain the mode of grid or list.
   */
  contentView(viewmode: string) {
    // this.start_user = 0;
    // this.end_user = 20;
    // let userlimit = {};
    // if (this.searchValue_data != '') {
    //   userlimit = {
    //     start_user: 0,
    //     end_user: 20,
    //     search_filter: true,
    //     searchValue: this.searchValue_data,
    //     Search_scorl: false,
    //   };
    // } else {
    //   userlimit = {
    //     start_user: 0,
    //     end_user: 20,
    //     search_filter: false,
    //     Search_scorl: false,
    //   };
    // }

    // this.userData = [];
    // this.getAllUserData(userlimit);
    if (viewmode == 'grid') {
      this.taskbarView = true;
    } else {
      this.taskbarView = false;
    }
  }

  /**
   * Download sample Excell for upload user.
   */
  UserManageArray = [
    {
      Firstname: '',
      Lastname: '',
      EMail: '',
      MobileNumber: '',
      Password: '',
    },
  ];

  Exceltempletedownload(filename) {
    this.adminService.download_data(this.UserManageArray, filename);
    // this.ServiceService.download_data(this.UserManageArray, filename)
  }

  /**
   * open metho to view the model popo up for add user process.
   * @param content Its contain the content of popup.
   * @param btn Its contain the function like add or edit.
   */

  openupload(content: any, btn: any) {
    this.PopupName = btn;
    this.save_clicked = false;
    this.modalService.open(content, { backdrop: 'static', keyboard: false });
    // this.modalService.open(content);
  }
  /**
   * onFileChange to read data in excell
   * @param title file name Its contain the file name.
   * @param evt Its contain the event of file change.
   */
  onFileChange(title, evt: any) {
    //  debugger
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length == 1 && evt.target.accept === '.xlsx,.xls,.csv') {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.datavalue = <any>XLSX.utils.sheet_to_json(ws, { header: 1 });
        let keys = this.datavalue.shift();
        let resArr = this.datavalue.map((e) => {
          let obj = {};
          keys.forEach((key, i) => {
            var keyname = key.replace(/\s/g, '');
            obj[keyname] = e[i];
          });
          return obj;
        });

        let objValue = [];
        objValue = resArr;
        // let tenantDetails = {
        //   tenantDeatails: JSON.parse(localStorage.tenantDeatails).tenantDeatails.tendetail,
        //   LoginKey: ''
        // }
        // this.registerService.scenarioRedirect(tenantDetails).then((result) => {
        // this.tenantEncryptData = result
        // this.tenantPreFix = this.tenantEncryptData[0].tenantPrefix
        // let excelMailValidate = false
        // for (let i = 0; i < resArr.length; i++) {
        // let check = (objValue[i].EMail).includes(this.tenantPreFix)
        // if (!check) {
        //   excelMailValidate = false
        //   break
        // } else {
        let excelMailValidate = true;
        // }
        // }

        if (excelMailValidate) {
          this.adminService.sendExcelldata(resArr).then((result) => {
            if (result.success) {
              this.modalService.dismissAll();
              this.toastr.success(result.message, '');
              this.start_user = 0;
              this.end_user = 20;
              let userlimit = {
                start_user: 0,
                end_user: 20,
                search_filter: true,
                Search_scorl: false,
                filterByRoleType:this.selectedFilterType,
                searchValue: this.searchValue_data,                
              };
              this.userData = [];
              this.getAllUserData(userlimit);
            } else {
              this.toastr.error(result.message, '');
            }
          });
        } else {
          this.toastr.error('Users email address not valid.', '');
        }
        // })
      };
      //};
      reader.readAsBinaryString(target.files[0]);
    }
  }
  
  get addRoleFormData(): any {
    return this.addRoleForm.controls;
  }

  get deleteUserFormData(): any {
    return this.deleteUserForm.controls;
  }

  addRoleFormSubmit(): boolean {
    this.addRoleTriggered = true;
    if (this.addRoleForm.invalid) {
      return;
    }
    const obj = this.addRoleForm.value;
    this.adminService.PostRoleData(obj).then((result) => {
      if (result.data && result.data.length) {
        this.roles = this.roles.concat(result.data);
        let el: HTMLElement = document.getElementById(
          'addRoleCloseBtn'
        ) as HTMLElement;
        el.click();
        this.toastr.success('Role created successfully', '');
      } else {
        this.toastr.error('Role already exists', '');
      }
    });
  }

  deleteUserFormSubmit(): boolean {
    if (this.deleteUserForm.invalid) {
      return;
    }
    const userEmail = this.deleteUserForm.value.user;
    this.adminService.deleteUser(userEmail).subscribe((response: any) => {
      this.userData = this.userData.filter(function( obj ) {
        return obj.email !== userEmail;
      });
      this.modalService.dismissAll();
      this.toastr.success(response['message'])
    }, (error) => {
      this.toastr.error(error.error, '');
    });
  }

   confirmUserDelete(modal, user: any) {
    this.deleteUserForm.controls.user.setValue(user.email)
    this.modalService.open(modal, { backdrop: 'static', keyboard: false, centered: true });
  }

  
  roleChangeEvent($event) {
    this.roles = $event;
  }

  userChangeEvent($event) {
    console.log($event)
    this.userData = $event;
  }

}
