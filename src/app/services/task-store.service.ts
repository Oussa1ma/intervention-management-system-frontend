import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share, takeUntil } from 'rxjs/operators';
import { Reponse } from '../models/reponse.model';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService {
  tasks: Task[] = [];
  tasksByTechnicien: Task[] = [];
  userId: string;

  tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  tasksByTechnicien$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(
    private taskService: TaskService,
    private uT: UtilitiesService) {
    this.userId = localStorage.getItem('userId');
    this.getTasks();
    this.getTasksByTechnicien();
  }


  getTasks(){
    this.taskService
      .getTasks()
      .subscribe((reponse: Reponse) => {
        this.tasks = reponse.data
        this.tasks$.next(this.tasks)
      })
    
    this.taskService
      .updatedTask$
      .subscribe((updatedTask: Task) => {
        if(updatedTask){
          const index = this.tasks.findIndex(
            (task: Task) => task._id == updatedTask._id
          );
          this.tasks[index] = updatedTask;
          this.tasks$.next(this.tasks)
        }
      })

    this.taskService
      .newTask$
      .subscribe((newTask: Task) => {
        if(newTask){
          const foundInTasks = this.uT.find(this.tasks, newTask)
          if(!foundInTasks){
            this.tasks.push(newTask);
            this.tasks$.next(this.tasks)
          }
        }
      })
    
    this.taskService
      .deletedTask$
      .subscribe((deletedTaskId: string) => {
        if(deletedTaskId){
          this.tasks = this.uT.filterById(this.tasks, deletedTaskId);
          this.tasks$.next(this.tasks);
        }
      })
  }

  getTasksByTechnicien(){
    this.taskService
      .getTasksByTechnicien(this.userId)
      .subscribe((reponse: Reponse) => {
        this.tasksByTechnicien = reponse.data;
        this.tasksByTechnicien$.next(this.tasksByTechnicien);
      })

    this.taskService
      .updatedTask$
      .subscribe((updatedTask: Task) => {
        if(updatedTask){
          const isMyTask = (updatedTask.technicien == this.userId);
          const foundInMyTasks = this.uT.find(this.tasksByTechnicien, updatedTask);
          if(!isMyTask && foundInMyTasks){
            this.tasksByTechnicien = this.uT.filter(this.tasksByTechnicien, updatedTask);
            this.tasksByTechnicien$.next(this.tasksByTechnicien);
          }
          if(isMyTask && !foundInMyTasks){
            this.tasksByTechnicien.push(updatedTask);
            this.tasksByTechnicien$.next(this.tasksByTechnicien);
          }
          if(isMyTask && foundInMyTasks){
            const index = this.tasksByTechnicien.findIndex(
              (task: Task) => task._id == updatedTask._id
            );
            this.tasksByTechnicien[index] = updatedTask;
            this.tasksByTechnicien$.next(this.tasksByTechnicien);
          }
        }
      })

    this.taskService
      .newTask$
      .subscribe((newTask: Task) => {
        if(newTask){
          const isMyTask = (newTask.technicien == this.userId);
          const foundInMyTasks = this.uT.find(this.tasksByTechnicien, newTask);
          if(isMyTask && !foundInMyTasks){
            this.tasksByTechnicien.push(newTask);
            this.tasksByTechnicien$.next(this.tasksByTechnicien);
          }
        }
      })

    this.taskService
    .deletedTask$
    .subscribe((deletedTaskId: string) => {
      if(deletedTaskId){
        const foundInMyTasks = this.uT.findById(this.tasksByTechnicien, deletedTaskId);
        if(foundInMyTasks){
          this.tasksByTechnicien = this.uT.filterById(this.tasksByTechnicien, deletedTaskId);
          this.tasksByTechnicien$.next(this.tasksByTechnicien);
        }
      }
    })
  }


  
}
