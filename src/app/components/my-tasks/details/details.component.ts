import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { UtilitiesService } from 'src/app/services/utilities.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reponse } from 'src/app/models/reponse.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  allProgres: number[];
  reportForm: FormGroup;
  progresForm: FormGroup;
  myTask: Task;
  showReport: boolean = false;
  isPaused: boolean
  isBegun: boolean
  interactionDisabled: boolean

  public Editor = ClassicEditor;

  private unsubscribe$ = new Subject<boolean>();

  constructor(
    private uT: UtilitiesService,
    private navigation: Router,
    private taskService: TaskService
  ) {
    this.intitializeReportForm();
    this.intitializeProgresForm();
    this.myTask = history.state.myTask;
    this.isBegun = this.myTask?.isBegun;
    console.log(`isBegun: ${this.isBegun}`);
    this.isPaused = this.myTask?.isPaused;
    this.interactionDisabled = this.myTask?.interactionDisabled;
  }

  ngOnInit(): void {
    if (!this.myTask) this.navigation.navigate(['my-tasks']);
    console.log(this.myTask);
  }

  intitializeReportForm() {
    this.reportForm = new FormGroup({
      reportTitle: new FormControl(),
      reportContent: new FormControl(),
    });
  }

  intitializeProgresForm() {
    this.progresForm = new FormGroup({
      progres: new FormControl(),
    });
    this.allProgres = [0, 10, 20, 40, 60, 80, 100];
  }

  get progres() {
    return this.progresForm.get('progres');
  }

  get reportTitle() {
    return this.reportForm.get('reportTitle');
  }

  get reportContent() {
    return this.reportForm.get('reportContent');
  }

  updateProgres(id: string, progres: number) {
    let data = null;

    if (progres == 100) {
      data = {
        body: {
          progres: progres,
          seen: false,
          isBegun: true,
          isPaused: false,
          interactionDisabled: true
        },
        params: { id: id },
      };
    } else if(progres == 0) {
      data = {
        body: {
           progres: progres,
           isBegun: false,
           isPaused: false,
           interactionDisabled: true },
        params: { id: id },
      };
    }
     else {
      data = {
        body: { progres: progres },
        params: { id: id },
      };
    }

    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reponse: Reponse) => {

        this.myTask = reponse.data;
        if(this.myTask.progres == 0 || this.myTask.progres == 100){
          this.isBegun = this.myTask.isBegun
          this.isPaused = this.myTask.isPaused
          this.interactionDisabled = this.myTask.interactionDisabled
        }

        console.log(reponse.message);
      });
  }

  getDateDifference(given) {
    return this.uT.getDateDifference(given);
  }

  updateIsBegun() {
    if(this.isBegun != undefined){
      const data = {
        body: { isBegun: this.isBegun },
        params: { id: this.myTask?._id },
      };
      this.taskService.updateTask(data).subscribe();
    }
  }

  updateIsPaused() {
    if(this.isPaused != undefined){
      const data = {
        body: { isPaused: this.isPaused },
        params: { id: this.myTask?._id },
      };
      this.taskService.updateTask(data).subscribe();  
    }
  }

  updateInteractionDiabled() {
    if(this.interactionDisabled != undefined){
      const data = {
        body: { interactionDisabled: this.interactionDisabled },
        params: { id: this.myTask?._id },
      };
      this.taskService.updateTask(data).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.updateIsBegun();
    this.updateInteractionDiabled();
    this.updateIsPaused();
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
