import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/models/task.model';
import { Technicien } from 'src/app/models/technicien.model';
import { TaskService } from 'src/app/services/task.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  taskForm: FormGroup
  descriptionForm: FormGroup
  priorities: String[]



  @Input() tasks: Task[] = []
  @Input() techniciens: Technicien[]

  @Input() searchTerm: string
  @Input() selectedFilter: string

  @Output() updateTaskOwnerEvent = new EventEmitter<Object>();
  @Output() updateTaskPriorityEvent = new EventEmitter<Object>();
  @Output() updateTaskDescriptionEvent = new EventEmitter<Object>();
  @Output() deleteTaskEvent = new EventEmitter<string>();

  username: string

  constructor(
    private modalService: NgbModal,
    private uT: UtilitiesService,
  ) {
    this.intitializeForms()
   }


  ngOnInit(): void {
    console.log(`selectedFilter ${this.selectedFilter}`)
    this.priorities = ['Haute', 'Moyenne', 'Faible']
  }


  intitializeForms(){
    this.taskForm = new FormGroup({
      technicien: new FormControl(),
      priority: new FormControl()
    })

    this.descriptionForm = new FormGroup({
      description: new FormControl()
    })
  }


  updateTaskOwner(taskId: string, technicienName: string){
    this.updateTaskOwnerEvent.emit({'taskId': taskId, 'technicienName': technicienName})
  }


  updateTaskPriority(taskId: string, priority: string){
    this.updateTaskPriorityEvent.emit({'taskId': taskId, 'priority': priority})
  }


  updateTaskDescription(taskId: string, description: string){
    this.updateTaskDescriptionEvent.emit({'taskId': taskId, 'description': description})
  }

  deleteTask(id: string){
    this.deleteTaskEvent.emit(id)
  }


  // get select inputs values
  get technicien(){
    return this.taskForm.get('technicien')
  }

  
  get priority(){
    return this.taskForm.get('priority')
  }


  get description(){
    return this.descriptionForm.get('description')
  }


  open(content, id: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', keyboard: false, centered: true, backdrop: 'static'})
    this.descriptionForm.patchValue({
      description: this.tasks.find((task: Task) => task._id == id).description
    })
  }

  
  getDateDifference(given){
    return this.uT.getDateDifference(given)
  }
}
