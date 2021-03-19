import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorFormComponent } from './author-form/author-form.component';
import { AuthorInfoComponent } from './author-info/author-info.component';
import { DescriptionFormComponent } from './description-form/description-form.component';
import { FormArrayListComponent } from './form-array-list/form-array-list.component';


@NgModule({
  declarations: [
    AuthorFormComponent,
    AuthorInfoComponent,
    DescriptionFormComponent,
    FormArrayListComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,

    AuthorFormComponent,
    AuthorInfoComponent,
    DescriptionFormComponent,
    FormArrayListComponent,
  ],
})
export class SharedModule {
}
