import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { ToastrModule } from 'ngx-toastr';

import { DashboardModule } from './components/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './components/pages/pages.module';
import { UsersModule } from './components/users/users.module';
import { SettingModule } from './components/setting/setting.module';;
import { ReportsModule } from './components/reports/reports.module';
import { TaskModule } from './components/task/task.module';
import { AuthModule } from './components/auth/auth.module';
import { AuthGuard } from './Guard/auth.guard';
import { LoginService } from './services/login.service';
import { TechnicienService } from './services/technicien.service';
import { TaskService } from './services/task.service';
import { LogoutGuard } from './Guard/logout.guard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MyTasksModule } from './components/my-tasks/my-tasks.module'
import { UtilitiesService } from './services/utilities.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    AppRoutingModule,
    DashboardModule,
    SettingModule,
    ReportsModule,
    AuthModule,
    SharedModule,
    PagesModule,
    UsersModule,
    TaskModule,
    MyTasksModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard, LogoutGuard, LoginService, UtilitiesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
