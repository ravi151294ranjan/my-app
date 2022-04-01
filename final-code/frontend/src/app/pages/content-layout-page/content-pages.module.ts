import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentPagesRoutingModule } from './content-pages-routing.module';
import { LoginComponent } from './login/login.component';
import { ScenarioTestComponent } from './scenario-test/scenario-test.component';
import { RegisterComponent } from './register/register.component';
import { ErrorComponent } from './error/error.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SafePipe } from 'app/shared/pipes/safe.pipe';
import { ShorturlRedirectionComponent } from './shorturl-redirection/shorturl-redirection.component';
import { PasswordredirectComponent } from './forgotpassword/passwordredirect/passwordredirect.component';
import { PwdchangeFirstLoginComponent } from './pwdchange-first-login/pwdchange-first-login.component';
import { VerifyRegisterComponent } from './verify-register/verify-register.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { AssetViewerComponent } from './asset-viewer/asset-viewer.component';

/**
 * Content pages contain the component using without side bar and  top bar.
 */
@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule, ReactiveFormsModule,
        SharedModule,NgxSpinnerModule
    ],
    declarations: [
        SafePipe,
        LoginComponent, ScenarioTestComponent, RegisterComponent,ErrorComponent,
         ForgotpasswordComponent,
         ShorturlRedirectionComponent,
         PasswordredirectComponent,
         PwdchangeFirstLoginComponent,
         
         VerifyRegisterComponent,
         AssetViewerComponent
    ]
})
export class ContentPagesModule { }
