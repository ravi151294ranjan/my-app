import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../admin-services/admin-services.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class RoleManagementComponent implements OnInit {

  @Input() roles: Array<any>;
  @Input() users: Array<any>;
  @Output() roleChangeEvent = new EventEmitter<Array<string>>();
  @Output() userChangeEvent = new EventEmitter<Array<string>>();
  addRoleForm: FormGroup;
  renameRoleForm: FormGroup;
  addRoleTriggered: boolean;
  renameRoleTriggered: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.addRoleTriggered = false;
    this.addRoleForm = this.formBuilder.group({
      name: new FormControl('', Validators.required)
    });

    this.renameRoleForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      newname: new FormControl('', Validators.required)
    })
  }

  /**
   *  On ngOnint method to call getAllGroups and getAllUserData methods.
   */
   ngOnInit() {
    console.log(this.users, "===========================")
  }

  get addRoleFormData(): any {
    return this.addRoleForm.controls;
  }

  get renameRoleFormData(): any {
    return this.renameRoleForm.controls;
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
        this.addRoleForm.reset();
        this.addRoleTriggered = false;
        this.toastr.success('Role created successfully', '');
        this.roleChangeEvent.emit(this.roles)
      } else {
        this.toastr.error('Role already exists', '');
      }
    }, (error) => {
      this.toastr.error(error.error.error, '')
    });
  }

  renameRoleFormSubmit(): boolean {
    this.renameRoleTriggered = true;
    if (this.renameRoleForm.invalid) {
      return;
    }
    const obj = this.renameRoleForm.value;
    this.adminService.updateRole(obj).subscribe((result: any) => {
      let index = this.roles.indexOf(obj.name);
      if (index !== -1) {
        this.roles[index] = obj.newname;
      }
      this.renameRoleTriggered = false;
      this.renameRoleForm.reset();
      this.toastr.success('Role renamed successfully', '')
      this.roleChangeEvent.emit(this.roles);
      this.users = this.users.map(el => el.role == obj.name ? {...el, role: obj.newname} : el);
      this.userChangeEvent.emit(this.users);
    }, (error) => {
      this.toastr.error(error.error.error, '')
    });
  }
}
