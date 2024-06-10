import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reponse } from 'src/app/models/reponse.model';
import { Technicien } from 'src/app/models/technicien.model';
import { TaskService } from 'src/app/services/task.service';
import { TechnicienService } from 'src/app/services/technicien.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit, OnDestroy {

  taskForm: FormGroup
  priorities: string[]
  selectedPriority: string
  types: string[]
  selectedType: string
  techniciens: Technicien[]
  selectedTechnicien: AbstractControl

  private unsubscribe$ = new Subject<boolean>()

  isAdmin: boolean

  
  constructor(
    private taskService: TaskService,
    private technicienService: TechnicienService,
    private navigation: Router,
    private toastr: ToastrService
    ){
    }
    
    
    ngOnInit(): void {
      
      console.log('create-task component init')
      this.initializeForm()
      this.getTechniciens()
    }
  

  initializeForm(){
    // Form initialization
    this.taskForm = new FormGroup({
      'title': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'assignTo': new FormControl(),
      'type': new FormControl(['Réseau', 'Maintenance']),
      'priority': new FormControl(),
      'client': new FormControl(),
      'description': new FormControl('', [Validators.required, Validators.minLength(5)])
    })

    this.priorities = ['Haute', 'Moyenne', 'Faible']
    this.types = ['Réseau', 'Développement', 'Maintenance']
  }


  getTechniciens(){
    this.technicienService.allTechniciens()
    .pipe(takeUntil(this.unsubscribe$)).
    subscribe((reponse: Reponse) =>{
      this.techniciens = reponse.data.filter(technicien => !technicien.role)
      this.taskForm.patchValue({
        assignTo: this.techniciens[0].username,
        priority: this.priorities[0],
        type: this.types[0]
      }),
      (err)=> {
        
      }
    })
  }


  onSubmit(): void {
    this.taskService.postTask(this.taskForm.value)
    .subscribe((reponse: Reponse) => {
      if(reponse.success){
        this.toastr.info(reponse.message, 'Tâche', 
        {
          timeOut: 2500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        
        this.navigation.navigate(['tasks/tasks-list'])
      }
    })
  }

  
  selectTechnicien(event): void {
    this.taskForm.patchValue({
      assignTo: event.target.value
    })
    
    this.selectedTechnicien = this.taskForm.get('assignTo')
  }


  selectType(event): void {
    this.taskForm.patchValue({
      type: event.target.value
    })
  }


  selectPriority(event): void {
    this.taskForm.patchValue({
      priority: event.target.value
    })
  }
  

  get title() { return this.taskForm.get('title')}


  ngOnDestroy(): void {
    this.unsubscribe$.next(true)
    this.unsubscribe$.complete()
  }
}
