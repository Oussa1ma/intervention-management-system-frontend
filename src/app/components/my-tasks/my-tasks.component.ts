import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { Reponse } from 'src/app/models/reponse.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Report } from 'src/app/models/report.model';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})

export class MyTasksComponent implements OnInit, OnDestroy, AfterViewInit {

  myTasks: Task[] = []
  myTasksStore: Task[] = []
  myTasksForm: FormGroup
  elements: HTMLElement[] = []
  isAdmin: boolean
  allProgres: number[]
  userId: string
  closeResult: string
  // searchTerm: string

  data = '<p>Hello, world!</p>'

  public Editor = ClassicEditor;


  @ViewChild('tout') tout: ElementRef
  @ViewChild('terminee') terminee: ElementRef
  @ViewChild('enCours') enCours: ElementRef
  @ViewChild('nouvelle') nouvelle: ElementRef

  @ViewChild('details') details: ElementRef

  private unsubscribe$ = new Subject<boolean>()
  searchTerm: string;
  selectedFilter: string;

  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private uT: UtilitiesService
  ) {
    this.intitializeForm()
    this.userId = localStorage.getItem('userId')
    this.Editor.editorConfig = function( config ){
      config.height = '800px';
    }
  }

  ngOnInit(): void {
    this.getTasks()
    this.onUpdateTask()
    this.onDeleteTask()
  }
  
  
  ngAfterViewInit(): void {
    this.tout.nativeElement.classList.add('filter-item')

    this.elements.push(this.tout.nativeElement as HTMLElement)
    this.elements.push(this.terminee.nativeElement as HTMLElement)
    this.elements.push(this.enCours.nativeElement as HTMLElement)
    this.elements.push(this.nouvelle.nativeElement as HTMLElement)    
  }
  

  intitializeForm(){
    this.myTasksForm = new FormGroup({
      progres: new FormControl(),
      reportTitle: new FormControl(),
      reportContent: new FormControl(),
    })

    this.allProgres = [0, 10, 20, 40, 60, 80, 100]
  }

  get progres() {
    return this.myTasksForm.get('progres')
  }

  get reportTitle() {
    return this.myTasksForm.get('reportTitle')
  }

  get reportContent() {
    return this.myTasksForm.get('reportContent')
  }


  getTasks() {
    this.taskService
      .getTasksByTechnicien(this.userId)
      .pipe(takeUntil(this.unsubscribe$), pluck('data'))
      .subscribe((tasks: Task[]) => {
        this.myTasks = tasks
        console.log(this.myTasks)
    })
    
    this.taskService
      .newTask$
      .subscribe((newTask: Task) => {
        if(newTask){
       
          const isMyTask = (newTask.technicien == this.userId)
          const foundInMyTasks = this.uT.find(this.myTasks, newTask)
       
          if(isMyTask && !foundInMyTasks){
            this.myTasks.push(newTask)
          }
        }
    })
  }


  onUpdateTask(){
    this.taskService
      .updatedTask$
      .subscribe((updatedTask: Task) => {
        if(updatedTask){
      
          const isMyTask = (updatedTask.technicien == this.userId)
          const foundInMyTasks = this.uT.find(this.myTasks, updatedTask)
      
          if(!isMyTask){
            this.myTasks = this.uT.filter(this.myTasks, updatedTask)
            return
          }else if(!foundInMyTasks){
            this.myTasks.push(updatedTask)
            return
          }

          // replace the updated task in the local array
          const index = this.myTasks.findIndex((task: Task) => 
                task._id == updatedTask._id)

          this.myTasks[index] = updatedTask
        }
      })
  }

  
  onDeleteTask(){
    this.taskService
      .deletedTask$
      .subscribe((deletedTasId: string) => {
        this.myTasks = this.uT.filterById(this.myTasks, deletedTasId)
      })
  }


  updateProgres(id: string, progres: number){
    let data = null

    if(progres == 100){
      data = {
        body: {
                progres: progres,
                seen: false
              },
        params: {id: id}
      }
    }else{
      data = {
        body: { progres: progres },
        params: {id: id}
      }
    }
    
    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reponse: Reponse) => {
        console.log(reponse.message)
      });
  }

  updateTaskReport(taskId: string, report: Report){
    console.log(report)
    const data = {
      body: {report :report},
      params: {id: taskId}
    }

    this.taskService
      .updateTask(data)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((reponse: Reponse) => {
      });
  }

  
  closedTasksFilter(){
    this.myTasks = this.myTasks.filter((task: Task) => task.progres == 100)
    this.taskService
      .getTasksByTechnicien(this.userId)
      .pipe(takeUntil(this.unsubscribe$), pluck('data'))
      .subscribe((tasks: Task[]) => {
        this.myTasks = tasks.filter((task: Task) => task.progres == 100 )
      })
  }


  currentTasksFilter(){
    this.myTasks = this.myTasks.filter((task: Task) => task.progres > 0 && task.progres < 100 )
    this.taskService
      .getTasksByTechnicien(this.userId)
      .pipe(takeUntil(this.unsubscribe$), pluck('data'))
      .subscribe((tasks: Task[]) => {
        this.myTasks = tasks.filter((task: Task) => task.progres > 0 && task.progres < 100)
      })
  }


  newTasksFilter(){
    this.myTasks = this.myTasks.filter((task: Task) => task.progres == 0)
    this.taskService
      .getTasksByTechnicien(this.userId)
      .pipe(takeUntil(this.unsubscribe$), pluck('data'))
      .subscribe((tasks: Task[]) => {
        this.myTasks = tasks.filter((task: Task) => task.progres == 0)
      })
  }


  applyStyle(element: HTMLElement){

    if(!element.classList.contains('filter-item'))
      element.classList.add('filter-item')

    this.elements.forEach((ele: HTMLElement) => {
      if(ele.textContent != element.textContent)
        ele.classList.remove('filter-item')
    })
  }


  open(content, id: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,keyboard: false, centered: true, backdrop: 'static', })
    this.myTasksForm.patchValue({
      reportTitle: this.myTasks.find((task: Task) => task._id == id).report?.title,
      reportContent: this.myTasks.find((task: Task) => task._id == id).report?.content
    })
  }


  getDateDifference(given){
    return this.uT.getDateDifference(given)
  }

  searchInputEvent(value: string) {
    this.searchTerm = value;
  }

  selectedFilterEvent(value: string) {
    this.selectedFilter = value;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true)
    this.unsubscribe$.complete()
    console.log('task-list end');
    
  }
}

