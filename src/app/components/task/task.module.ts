import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';


import { TaskRoutingModule } from './task-routing.module';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { ItemComponent } from './tasks-list/item/item.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { FilterByPipe } from 'src/app/shared/pipes/filterBy.pipe';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CreateTaskComponent, TasksListComponent, ItemComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSnackBarModule,
    ToastrModule.forRoot()
  ]
})
export class TaskModule { }
