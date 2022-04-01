import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsermanageComponent } from './usermanage/usermanage.component';
// import { AuthGuard } from 'app/shared/auth/auth-guard.service';
import { AuthGuard } from '../../shared/auth/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { ScenarioBuilderComponent } from './scenario/scenario-builder/scenario-builder.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfileComponent } from './profile/profile.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { HtmlContentComponent } from './content-management/html-content/html-content.component';
import { AdminVideoContentComponent } from './content-management/videoContent/videoContent.component';
import { ImportedHtmlContentComponent } from './content-management/imported-html-content/imported-html-content.component';
import { ContentStructureComponent } from './content-structure/content-structure.component';
import { SopContentComponent } from './content-structure/sop-content/sop-content.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Dashboard'
    },
  },
  {
    path: 'users',
    component: UsermanageComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Users'
    }
  },
  {
    path: 'report',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'report'
    }
  },


  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'profiles'
    }
  },
  {
    path: 'content',
    component: ContentManagementComponent,
    canActivate: [AuthGuard],
    data: { title: 'Content Management' },
    // children: [
    //   {
    //     path:'html-content',
    //     component:HtmlContentComponent,
    //     canActivate:[AuthGuard],
    //     data : {title:'Content Management'},
    //   },
    // ]
  },
  {
    path: 'html-content',
    component: HtmlContentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Content Management' },
  },
  {
    path: 'video-content',
    component: AdminVideoContentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Video Content Management' },
  },
  {
    path: 'imported-html-content',
    component: ImportedHtmlContentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Content Management' },
  },
  {
    path: 'html-content/edit/:id/:versionId',
    component: HtmlContentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Content Management' },
    },
    {
      path: 'video-content/edit/:id',
      component: AdminVideoContentComponent,
      canActivate: [AuthGuard],
      data: { title: 'Video Content Management' },
    },
    {
      path: 'imported-html-content/edit/:id',
      component: ImportedHtmlContentComponent,
      canActivate: [AuthGuard],
      data: { title: 'Content Management' },
    },
    {
      path: 'content-structure',
      component: ContentStructureComponent,
      canActivate: [AuthGuard],
      data: { title: 'Content Structure'},
    },
    {
      path: 'sop-content',
      component: SopContentComponent,
      canActivate: [AuthGuard],
      data: { title: 'SOP Content'},
    },

    {
      path: 'sop-content/edit',
      component: SopContentComponent,
      canActivate: [AuthGuard],
      data: { title: 'SOP Content'},
    },
    // {
    //   path: 'content-structure',
    //   component: ContentStructureComponent,
    //   canActivate: [AuthGuard],
    //   data: { title: 'Content Structure'},
    // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPagesRoutingModule { }
