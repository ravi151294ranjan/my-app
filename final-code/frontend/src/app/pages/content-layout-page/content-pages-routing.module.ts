import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component'
import { AuthGuard } from '../../shared/auth/auth-guard.service';
import { ScenarioTestComponent } from './scenario-test/scenario-test.component';
import { RegisterComponent } from './register/register.component';
import { ErrorComponent } from './error/error.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ShorturlRedirectionComponent } from './shorturl-redirection/shorturl-redirection.component';
import { PasswordredirectComponent } from './forgotpassword/passwordredirect/passwordredirect.component';
import { PwdchangeFirstLoginComponent } from './pwdchange-first-login/pwdchange-first-login.component';
import { VerifyRegisterComponent } from './verify-register/verify-register.component';
import { AssetViewerComponent } from './asset-viewer/asset-viewer.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'loginshort/:id',
        component: ShorturlRedirectionComponent,
        data: {
          title: 'short Page'
        }
      },      {
        path: 'loginshort/:id/:scenarioid',
        component: ShorturlRedirectionComponent,
        data: {
          title: 'short Page'
        }
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'scenario-test',
        component: ScenarioTestComponent,
        data: {
          title: 'Scenario Page'
        }
      },

       {
        path: 'forgotpass',
        component: ForgotpasswordComponent,
        data: {
          title: 'forgot password'
        }
      },
      {
        path: 'pwdchangeFirstLogin',
        component: PwdchangeFirstLoginComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'change password'
        }
      },
      {
        path: 'assetviewer/:id',
        component: AssetViewerComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Asset Viewer'
        }
      },
      
      {
        path: 'verifyregister/:id',
        component: VerifyRegisterComponent,
        data: {
          title: 'verify register'
        }
      },

      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'Register Page'
        }
      },


      {
        path: 'passwordredirect/:id',
        component: PasswordredirectComponent,
        data: {
          title: 'Passwordredirect Page'
        }
      },

      {
        path: 'error',
        component: ErrorComponent,
        data: { title: 'error Views' }
      },
      {
        path: '**',
        component: ErrorComponent,
        data: { title: 'error Views' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
/**
 * Routing module  contain the routes of components in content layout page.
 */
export class ContentPagesRoutingModule { }
