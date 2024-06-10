import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForbidAdminGuard } from 'src/app/Guard/forbid-admin.guard';
import { MyTasksComponent } from './my-tasks.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [ForbidAdminGuard],
    component: MyTasksComponent,
    data: {
      title: "Mes tâches",
      breadcrumb: "Mes tâches"
    },

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTasksRoutingModule { }
