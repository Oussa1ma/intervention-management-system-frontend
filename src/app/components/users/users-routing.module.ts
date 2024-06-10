import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ForbidTechnicienGuard } from 'src/app/Guard/forbid-technicien.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ForbidTechnicienGuard],
    children: [
      {
        path: 'list-user',
        component: ListUserComponent,
        data: {
          title: "Techniciens",
          breadcrumb: "Liste"
        }
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        data: {
          title: "Ajouter un technicien",
          breadcrumb: "Ajouter"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
