import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SafePipepipe } from 'app/shared/pipes/safepipe.pipe';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullPagesRoutingModule } from './full-pages-routing.module';
import { UsermanageComponent } from './usermanage/usermanage.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from './usermanage/search.pipe';
// import { ScenarioBuilderComponent } from './scenario/scenario-builder/scenario-builder.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ArchwizardModule } from 'angular-archwizard';

import { OrderModule } from 'ngx-order-pipe';
import { ReportsComponent } from './reports/reports.component';
// import { FileSelectDirective,FileUploadModule } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatchHeightModule } from '../../shared/directives/match-height.directive';
import { ChartistModule } from 'ng-chartist';
import { ProfileComponent } from './profile/profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
// import { ToggleFullscreenDirective } from "../../shared/directives/toggle-fullscreen.directive2";
import { NgxSpinnerModule } from 'ngx-spinner';

import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';

import { ContentManagementComponent } from './content-management/content-management.component';
import { HtmlContentComponent } from './content-management/html-content/html-content.component';
import { AdminVideoContentComponent } from './content-management/videoContent/videoContent.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ImportedHtmlContentComponent } from './content-management/imported-html-content/imported-html-content.component';
import { StripTagsPipe } from 'app/shared/pipes/striptags.pipe';
import { ToggleButtonComponent } from '../../shared/animations/toggleswitch/toggle-button.component';
import { ContentStructureComponent } from './content-structure/content-structure.component';
import { SopContentComponent } from './content-structure/sop-content/sop-content.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    FullPagesRoutingModule,
    NgxDatatableModule,
    NgbPaginationModule,
    ArchwizardModule,
    NgbModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DragulaModule,
    OrderModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileUploadModule,
    MatchHeightModule,
    ChartistModule,
    NgSelectModule,
    NgxSpinnerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    CKEditorModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    DragDropModule
  ],
  declarations: [
    StripTagsPipe,
    SafePipepipe,
    // ToggleFullscreenDirective,
    DashboardComponent,
    UsermanageComponent,
    RoleManagementComponent,
    SearchPipe,
    ReportsComponent,
    ProfileComponent,
    ContentManagementComponent,
    HtmlContentComponent,
    AdminVideoContentComponent,
    ImportedHtmlContentComponent,
    ToggleButtonComponent,
    ContentStructureComponent,
    SopContentComponent,
  ],
})
export class FullPagesModule {}
