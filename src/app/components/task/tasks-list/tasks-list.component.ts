import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { Reponse } from 'src/app/models/reponse.model';
import { Task } from 'src/app/models/task.model';
import { Technicien } from 'src/app/models/technicien.model';
import { TaskService } from 'src/app/services/task.service';
import { TechnicienService } from 'src/app/services/technicien.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit, OnDestroy, AfterViewInit {
  tasks: Task[] = [];

  techniciens: Technicien[] = [];
  selectedTechnicien: Technicien;

  elements: HTMLElement[] = [];

  searchTerm: string;
  selectedFilter: string;

  isAdmin: boolean;

  private unsubscribe$ = new Subject<boolean>();

  @ViewChild('tout') tout: ElementRef;
  @ViewChild('terminee') terminee: ElementRef;
  @ViewChild('enCours') enCours: ElementRef;
  @ViewChild('nouvelle') nouvelle: ElementRef;

  constructor(
    private taskService: TaskService,
    private technicienService: TechnicienService,
    private uT: UtilitiesService
  ) {
    this.isAdmin = JSON.parse(localStorage.getItem('role'));
  }

  ngOnInit(): void {
    this.getTasks();
    this.getTechniciens();
    this.onUpdateTask();
    this.onDeleteTask();
  }

  ngAfterViewInit(): void {
    this.tout.nativeElement.classList.add('filter-item');

    this.elements.push(this.tout.nativeElement as HTMLElement);
    this.elements.push(this.terminee.nativeElement as HTMLElement);
    this.elements.push(this.enCours.nativeElement as HTMLElement);
    this.elements.push(this.nouvelle.nativeElement as HTMLElement);
  }

  getTasks() {
    this.tasks = this.tasks.filter((task: Task) => true);
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response: Reponse) => {
          this.tasks = response.data;
        },
        (error) => {}
      );

    this.taskService.newTask$.subscribe((task: Task) => {
      if (task) {
        if (!this.tasks.find((myTask: Task) => myTask._id == task._id)) {
          this.tasks.push(task);
        }
      }
    });
  }

  getTechniciens() {
    this.technicienService
      .allTechniciens()
      .pipe(takeUntil(this.unsubscribe$), pluck('data'))
      .subscribe((techniciens: Technicien[]) => {
        this.techniciens = techniciens.filter(
          (technicien: Technicien) => !technicien.role
        );
      });
  }

  updateTaskOwner(event) {
    // get the selected User
    this.selectedTechnicien = this.techniciens.find(
      (technicien) => technicien.username == event.technicienName
    );

    const data = {
      body: {
        technicien: this.selectedTechnicien._id,
        username: this.selectedTechnicien.username,
        progres: 0,
        seen: false,
      },
      params: { id: event.taskId },
    };

    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  updateTaskPriority(event) {
    const data = {
      body: {
        priority: event.priority,
      },
      params: { id: event.taskId },
    };

    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  updateTaskDescription(event) {
    const data = {
      body: {
        description: event.description,
      },
      params: { id: event.taskId },
    };
    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reponse: Reponse) => {
        let title = 'Tâche';
        if (reponse.success) this.uT.infoToastr(reponse.message, title);
        else this.uT.errorToastr(reponse.message, title);
      });
  }

  deleteTask(id: string) {
    this.taskService
      .deleteTask(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reponse: Reponse) => {
        if ((reponse.message = 'Supprimée avec succès')) {
        }
      });
  }

  closedTasks() {
    this.tasks = this.tasks.filter((task: Task) => task.progres == 100);
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: Reponse) => {
        this.tasks = response.data.filter((task: Task) => task.progres == 100);
      });
  }

  currentTasks() {
    this.tasks = this.tasks.filter(
      (task: Task) => task.progres != 0 || task.progres != 100
    );
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: Reponse) => {
        this.tasks = response.data.filter(
          (task) => task.progres != 0 && task.progres != 100
        );
      });
  }

  newTasks() {
    this.tasks = this.tasks.filter((task: Task) => task.progres == 0);
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: Reponse) => {
        this.tasks = response.data.filter((task) => task.progres == 0);
      });
  }

  onUpdateTask() {
    this.taskService.updatedTask$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedTask: Task) => {
        if (updatedTask) {
          const index = this.tasks.findIndex(
            (task: Task) => task._id == updatedTask._id
          );
          this.tasks[index] = updatedTask;
        }
      });
  }

  onDeleteTask() {
    this.taskService.deletedTask$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id: string) => {
        this.tasks = this.tasks.filter((task: Task) => task._id != id);
      });
  }

  applyStyle(element: HTMLElement) {
    if (!element.classList.contains('filter-item'))
      element.classList.add('filter-item');

    this.elements.forEach((ele: HTMLElement) => {
      if (ele.textContent != element.textContent)
        ele.classList.remove('filter-item');
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    console.log('task-list end');
  }

  searchInputEvent(value: string) {
    this.searchTerm = value;
  }

  selectedFilterEvent(value: string) {
    this.selectedFilter = value;
  }
}
