import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';


import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '', component: FullLayoutComponent,
    data: { title: 'full Views' }, children: Full_ROUTES,
    // canActivate: [AuthGuard]
  },
  {
    path: '', component: ContentLayoutComponent,
    data: { title: 'content Views' }, children: CONTENT_ROUTES,
  },
  {
    path: '*',
    redirectTo: 'login'
  }
];

/**
 * App routing module is a main routing module to connect full layout and content layout.
 */

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{ useHash: false })],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
