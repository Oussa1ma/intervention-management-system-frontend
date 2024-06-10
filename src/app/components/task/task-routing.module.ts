import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForbidTechnicienGuard } from 'src/app/Guard/forbid-technicien.guard';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';


const routes: Routes = [{
  path: '',
  canActivate: [ForbidTechnicienGuard],
  children: [
    {
      path: 'create-task',
      component: CreateTaskComponent,
      data: {
        title: "Créer une tâche",
        breadcrumb: "Créer"
      }
    },
    {
      path: 'tasks-list',
      component: TasksListComponent,
      data: {
        title: "Tâches",
        breadcrumb: "liste"
      }
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
