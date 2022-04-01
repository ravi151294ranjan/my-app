import { Injectable } from '@angular/core';
// import { HttpService } from 'app/shared/services/http.service';
import { HttpService } from '../../../shared/services/http.service';
// import { AppConfig } from 'app/shared/services/app_config';
import { AppConfig } from '../../../shared/services/app_config';
import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  domainName = AppConfig.IP_Address;
  constructor(private http: HttpService, private httpClient: HttpClient) {}
  /**
   * download_data service to download sample excell sheet for bulk user upload.<br>
   * @param json Its contain the column name.
   * @param excelFileName Its contain the excell file name.
   *
   */
  public download_data(json: any[], excelFileName: string): void {
    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(book, sheet, 'usermanage');
    XLSX.writeFile(book, excelFileName + '.xlsx');
  }

  /**
   * GetAllUser service to get user data list based on pagination start and end count.<br>
   * Api path/name => users?get_data  <br>
   * method => get<br>
   * @param get_data Its contain the start and end limit.
   * @return Its return the user list of data.
   */
  GetAllUser(get_data: any) {
    return this.httpClient.post(
      this.domainName + 'admin/users/user-list',
      get_data,
      AppConfig.header_info
    );    
  }

  GetRolesData() {
    return this.httpClient.get(
      this.domainName + 'admin/roles/',
      AppConfig.header_info
    );
  }

  updateRole(data: any) {
    return this.httpClient.put(
        this.domainName + 'admin/roles/', data,
        AppConfig.header_info
      );
  }

  PostRoleData(role_data: any) {
    return this.http
      .POSTMETHOD(
        this.domainName + 'admin/roles/',
        role_data,
        AppConfig.header_info
      )
      .then(
        (res: any) => {
          return res;
        },
        (err) => {
          return err;
        }
      )
      .catch((err) => {
        return err;
      });
  }

  deleteUser(user: any) {
    return this.httpClient.delete(
      this.domainName + 'admin/users/' + user,
      AppConfig.header_info
    );
  }

  /**
   * CreateSingleUser service to dd user data in collection.<br>
   * Api path/name => users  <br>
   * method => post<br>
   * @param add_data Its contain the user details.
   * @return Its return the success or failure message.
   */
  CreateSingleUser(add_data: any) {
    return this.httpClient.post(
      this.domainName + 'admin/users/',
      add_data,
      AppConfig.header_info
    );
  }
  /**
   * UpdateSingleUser service to update user data in collection. <br>
   * Api path/name => users/updateUser/   <br>
   * method => put <br>
   * @param add_data Its contain user data.
   * @return Its return the sucess or failure message based on data updation.
   */
  UpdateSingleUser(add_data: any) {
    return this.http
      .PUTMETHOD(
        this.domainName + 'admin/users/' + add_data.email,
        add_data,
        AppConfig.header_info
      )
      .then(
        (res: any) => {
          return res;
        },
        (err) => {
          return err;
        }
      )
      .catch((err) => {
        return err;
      });
  }

  /**
   * DeleteSingleUser service to delete user list based on user id.<br>
   * Api path/name => user/deleteUser/  <br>
   * method => delete <br>
   * @param id Its contain the user id.<br>
   * @return Its return success or failure message based on deletion method.
   */

  DeleteSingleUser(tenantDetails) {
    return this.http
      .DELETEMETHOD(
        this.domainName + 'users/deleteUser/' + tenantDetails.email,
        AppConfig.header_info
      )
      .then(
        (res: any) => {
          return res;
        },
        (err) => {
          return err;
        }
      )
      .catch((err) => {
        return err;
      });
  }

  /**
   * sendExcelldata service to vlidate excell sheet in bulk user upload <br>
   * Api path/name => users/bulkUserUploadJson/<br>
   * method => post <br>
   * @return Its return success or failure.
   */
  sendExcelldata(add_data) {
    return this.http
      .POSTMETHOD(
        this.domainName + 'users/bulkUserUploadJson/',
        add_data,
        AppConfig.header_info
      )
      .then(
        (res: any) => {
          return res;
        },
        (err) => {
          return err;
        }
      )
      .catch((err) => {
        return err;
      });
  }

  /**
   * Get user count
   * Api path/name => users/getcountOfuser <br>
   * method get
   * @return Its return the count
   */
  getcountOfuser() {
    return this.http
      .GETMETHOD(
        this.domainName + 'users/getcountOfuser/',
        AppConfig.header_info
      )
      .then(
        (res: any) => {
          return res;
        },
        (err) => {
          return err;
        }
      )
      .catch((err) => {
        return err;
      });
  }

  uploadFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('type', 'content-upload-video');
    formData.append('file', fileToUpload);
    return this.httpClient
      .post(this.domainName + 'admin/shared/upload-file/', formData, { headers: AppConfig.header_info });
  }

  uploadContent(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/upload-video/', data, { headers: AppConfig.header_info });
  }

  uploadPackage(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('type', 'content-upload-html-package');
    formData.append('file', fileToUpload);
    return this.httpClient
      .post(this.domainName + 'admin/shared/upload-file/', formData, { headers: AppConfig.header_info });
  }

  uploadImage(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('type', 'content-image');
    formData.append('file', fileToUpload);
    return this.httpClient
      .post(this.domainName + 'admin/shared/upload-file/', formData, { headers: AppConfig.header_info });
  }

  getLanguages() {
    return this.httpClient.get( this.domainName + 'admin/shared/get-languages/', AppConfig.header_info);
  }

  saveHtmlContent(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/save-html-content/', data, { headers: AppConfig.header_info });
  }

  saveImportedHtmlContent(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/save-imported-html-content/', data, { headers: AppConfig.header_info });
  }

  getContents(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/get-contents/', data, { headers: AppConfig.header_info });
  }
  deleteContent(data: object) {
    return this.httpClient
    .post(this.domainName + 'admin/content/delete-content/', data, { headers: AppConfig.header_info });
  }

  getContentById(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/get-content-by-id/', data, { headers: AppConfig.header_info });
  }
  getHtmlContentById(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/get-html-content-by-id/', data, { headers: AppConfig.header_info });
  }
 updateContent(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/update-content/', data, { headers: AppConfig.header_info });
  }
  getVersionList(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/content/get-version-list/', data, { headers: AppConfig.header_info });
  }


  //SOP router services
  saveSOPContent(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/contentstructure/save-sop-content/', data, { headers: AppConfig.header_info });
  }

  getSOPContents(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/contentstructure/get-sop-content/', data, { headers: AppConfig.header_info });
  }

  getSOPContentsById(data: object) {
    return this.httpClient
    .post(this.domainName + 'admin/contentstructure/get-content-by-id/', data, { headers: AppConfig.header_info });
  }

  updateSOPContent(data: object) {
    return this.httpClient
      .post(this.domainName + 'admin/contentstructure/update-sop-content/', data, { headers: AppConfig.header_info });
  }

  deleteSOPContent(data: object) {
    return this.httpClient
    .post(this.domainName + 'admin/contentstructure/delete-sop-content/', data, { headers: AppConfig.header_info });
  }

  uploadSopImage(fileToUpload: File) {
    console.log(fileToUpload);
    const formData: FormData = new FormData();
    formData.append('type', 'sop-content-image');
    formData.append('file', fileToUpload);
    console.log(formData)
    return this.httpClient
      .post(this.domainName + 'admin/shared/upload-sop-image/', formData, { headers: AppConfig.header_info });
  }
}
