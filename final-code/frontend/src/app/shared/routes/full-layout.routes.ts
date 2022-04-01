import { Routes, RouterModule } from '@angular/router';

// Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
  {
    path: 'changelog',
    loadChildren: () => import('../../changelog/changelog.module').then(m => m.ChangeLogModule)
  },
  {
    path: '',
    loadChildren: () => import('../../pages/full-layout-page/full-pages.module').then(m => m.FullPagesModule)
  }
];
