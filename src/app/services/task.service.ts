import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, ConnectableObservable, Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Reponse } from '../models/reponse.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements OnDestroy {
  url: string = environment.url;

  socket = io(environment.url);

  newTask$ = new BehaviorSubject<Task>(null);
  deletedTask$ = new BehaviorSubject<string>(null);
  updatedTask$ = new BehaviorSubject<Task>(null);

  constructor(private http: HttpClient) {
    this.newTaskNotif();
    this.updatedTaskNotif();
    this.deleteTaskNotif();
  }

  getTasks(): Observable<Reponse> {
    const headers = new HttpHeaders({
      'x-auth-token': localStorage.getItem('token'),
    });
    return this.http
      .get<Reponse>(`${this.url}/task`, { headers: headers })
      .pipe(shareReplay());
  }

  getTasksByTechnicien(id: string): Observable<Reponse> {
    const headers = new HttpHeaders({
      'x-auth-token': localStorage.getItem('token'),
    });
    return this.http
      .get<Reponse>(`${this.url}/technicien/task/${id}`, { headers: headers })
      .pipe(shareReplay());
  }

  postTask(task: Task): Observable<Reponse> {
    const headers = new HttpHeaders({
      'x-auth-token': localStorage.getItem('token'),
    });
    return this.http.post<Reponse>(`${this.url}/task`, task, {
      headers: headers,
    });
  }

  updateTask(data): Observable<Reponse> {
    const body = data.body;
    const id = data.params.id;
    const headers = new HttpHeaders({
      'x-auth-token': localStorage.getItem('token'),
    });
    return this.http.patch<Reponse>(`${this.url}/task/${id}`, body, {
      headers: headers,
    });
  }

  deleteTask(id: string): Observable<Reponse> {
    const headers = new HttpHeaders({
      'x-auth-token': localStorage.getItem('token'),
    });
    return this.http.delete<Reponse>(`${this.url}/task/${id}`, {
      headers: headers,
    });
  }

  newTaskNotif() {
    this.socket.on('newTask', (reponse: Reponse) => {
      this.newTask$.next(reponse.data);
    });
  }

  updatedTaskNotif() {
    this.socket.on('updatedTask', (reponse: Reponse) => {
      this.updatedTask$.next(reponse.data);
    });
  }

  deleteTaskNotif() {
    this.socket.on('deletedTask', (reponse: Reponse) => {
      this.deletedTask$.next(reponse.data);
    });
  }

  ngOnDestroy() {
    // this.stopPolling.next();
    console.log('Task service destroyed');
  }
}
