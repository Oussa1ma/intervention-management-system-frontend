import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MyTasksRoutingModule } from './my-tasks-routing.module';
import { MyTasksComponent } from './my-tasks.component';
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [MyTasksComponent],
  imports: [
    CommonModule,
    MyTasksRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class MyTasksModule { }
