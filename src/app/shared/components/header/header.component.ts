import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { LoginService } from 'src/app/services/login.service';
import { TaskService } from 'src/app/services/task.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NavService } from '../../service/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;

  public myTasks: Task[] = [];
  public numberOfTasks: number;
  public userId: string;
  public isAdmin: boolean;

  private unsubscribe$ = new Subject<boolean>();

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    private taskService: TaskService,
    private loginService: LoginService,
    private navigation: Router,
    private uT: UtilitiesService
  ) {
    this.userId = localStorage.getItem('userId');
    this.isAdmin = JSON.parse(localStorage.getItem('role'));
  }

  ngOnInit() {
    setTimeout(() => {
      this.getTasksOnInit();
    }, 2500);

    this.pushNotifsForNewTasks();
    this.pushNotifsForUpdatedTasks();
    this.pushNotifsForDeletedTasks();
  }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  right_side_bar() {
    this.right_sidebar = !this.right_sidebar;
    this.rightSidebarEvent.emit(this.right_sidebar);
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  getTasksOnInit() {
    if (this.isAdmin) {
      this.taskService
        .getTasks()
        .pipe(takeUntil(this.unsubscribe$), pluck('data'))
        .subscribe((tasks: Task[]) => {
          if (tasks.length == 0) this.emptyNotifs();
          this.myTasks = tasks.filter(
            (task: Task) => task.progres == 100 && !task.seen
          );
          if (this.myTasks.length != 0) this.playSound();
          this.numberOfTasks = this.myTasks.length;
        });
    }

    if (!this.isAdmin) {
      this.taskService
        .getTasksByTechnicien(this.userId)
        .pipe(takeUntil(this.unsubscribe$), pluck('data'))
        .subscribe((tasks: Task[]) => {
          this.myTasks = tasks.filter(
            (task: Task) => task.progres == 0 && !task.seen
          );
          if (this.myTasks.length != 0) this.playSound();
          this.numberOfTasks = this.myTasks.length;
        });
    }
  }

  pushNotifsForNewTasks() {
    this.taskService.newTask$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((newTask: Task) => {
        if (newTask) {
          if (!this.isAdmin) {
            const foundInMyTasks = this.uT.find(this.myTasks, newTask);
            const isMyTask = newTask.technicien == this.userId;
            if (isMyTask && !foundInMyTasks) {
              this.myTasks.push(newTask);
              this.playSound();
              this.numberOfTasks = this.myTasks.length;
            }
          }
        }
      });
  }

  pushNotifsForUpdatedTasks() {
    this.taskService.updatedTask$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedTask: Task) => {
        if (updatedTask) {
          const foundInMyTasks = this.uT.find(this.myTasks, updatedTask);

          if (this.isAdmin) {
            const isClosed = updatedTask.progres == 100;

            if (isClosed && !foundInMyTasks && !updatedTask.seen) {
              this.myTasks.push(updatedTask);
              this.numberOfTasks = this.myTasks.length;
              this.playSound();
            }
            if (!!foundInMyTasks && !isClosed) {
              this.myTasks = this.uT.filter(this.myTasks, updatedTask);
              this.numberOfTasks = this.myTasks.length;
            }
          }

          if (!this.isAdmin) {
            const isMyTask = updatedTask.technicien == this.userId;
            const isNew = updatedTask.progres == 0;

            if (!foundInMyTasks && isNew && isMyTask) {
              this.myTasks.push(updatedTask);
              this.numberOfTasks = this.myTasks.length;
              this.playSound();
            }

            if (updatedTask.progres > 0 || !isMyTask) {
              this.myTasks = this.uT.filter(this.myTasks, updatedTask);
              this.numberOfTasks = this.myTasks.length;
            }
          }
        }
      });
  }

  pushNotifsForDeletedTasks() {
    this.taskService.deletedTask$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deletedTaskId: string) => {
        if (deletedTaskId) {
          const foundInMyTasks = this.uT.findById(this.myTasks, deletedTaskId);

          if (foundInMyTasks) {
            this.myTasks = this.uT.filterById(this.myTasks, deletedTaskId);
            this.numberOfTasks = this.myTasks.length;
          }
        }
      });
  }

  emptyNotifs() {
    this.numberOfTasks = 0;
  }

  goToTaskFromNotifs(id: string) {
    const data = {
      body: { seen: true },
      params: { id: id },
    };
    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$), pluck('data'))
      .subscribe((updatedTask: Task) => {
        this.myTasks = this.uT.filter(this.myTasks, updatedTask);
        this.numberOfTasks = this.myTasks.length;
        if (this.isAdmin) this.navigation.navigate(['tasks/tasks-list']);
        else this.navigation.navigate(['my-tasks']);
      });
  }

  async playSound() {
    try {
      let audio = new Audio();
      audio.src = '../../../../assets/audio/alert.wav';
      audio.load();
      await audio.play();
    } catch (error) {
      console.log(error.message);
    }
  }

  ngOnDestroy(): void {
    console.log('header end');
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  logout() {
    this.loginService.logout();
  }
}
