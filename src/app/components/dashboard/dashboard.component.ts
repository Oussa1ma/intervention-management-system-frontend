import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { Reponse } from 'src/app/models/reponse.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public doughnutData = doughnutData;
  public pieData = pieData;

  isAdmin: boolean
  userId: string

  /**
   * Tech or tech === technicien
   */
  techClosedTasks: Task [] = []
  adminClosedTasks: Task [] = []
  adminNewTasks: Task [] = []
  allAdminTasks: Task [] = []
  allTechTasks: Task [] = []
  adminCurrentTasks: Task [] = []
  techCurrentTasks: Task [] = []
  techNewTasks: Task [] = []
  
  constructor(
    private taskService: TaskService,
    private uT: UtilitiesService
  ) {
    Object.assign(this, { doughnutData, pieData })
    
    this.isAdmin = JSON.parse(localStorage.getItem('role'))
    this.userId = localStorage.getItem('userId')
  }

  // doughnut 2
  public view = chartData.view;
  public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
  public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
  public doughnutChartGradient = chartData.doughnutChartGradient;
  public doughnutChartTooltip = chartData.doughnutChartTooltip;

  public chart5 = chartData.chart5;


  // lineChart
  public lineChartData = chartData.lineChartData;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartColors = chartData.lineChartColors;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartType = chartData.lineChartType;

  // lineChart
  public smallLineChartData = chartData.smallLineChartData;
  public smallLineChartLabels = chartData.smallLineChartLabels;
  public smallLineChartOptions = chartData.smallLineChartOptions;
  public smallLineChartColors = chartData.smallLineChartColors;
  public smallLineChartLegend = chartData.smallLineChartLegend;
  public smallLineChartType = chartData.smallLineChartType;

  // lineChart
  public smallLine2ChartData = chartData.smallLine2ChartData;
  public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
  public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
  public smallLine2ChartColors = chartData.smallLine2ChartColors;
  public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
  public smallLine2ChartType = chartData.smallLine2ChartType;

  // lineChart
  public smallLine3ChartData = chartData.smallLine3ChartData;
  public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
  public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
  public smallLine3ChartColors = chartData.smallLine3ChartColors;
  public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
  public smallLine3ChartType = chartData.smallLine3ChartType;

  // lineChart
  public smallLine4ChartData = chartData.smallLine4ChartData;
  public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
  public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
  public smallLine4ChartColors = chartData.smallLine4ChartColors;
  public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
  public smallLine4ChartType = chartData.smallLine4ChartType;

  public chart3 = chartData.chart3;

  // get closed tasks start
  getClosedTasks(){
    this.taskService
      .getTasks()
      .pipe(pluck('data'))
      .subscribe((tasks: Task[]) => {
        if(this.isAdmin)
          this.adminClosedTasks = tasks.filter((task: Task) => task.progres == 100)
        else{
          this.techClosedTasks = tasks.filter((task: Task) =>
              (task.progres == 100 && task.technicien == this.userId))
        }
      })
    
    this.taskService
      .updatedTask$
      .subscribe((updatedTask: Task) => {
        if(updatedTask){
          const isClosed = (updatedTask.progres == 100)
          
          if(this.isAdmin){
            
            const foundInClosedTasks = this.uT.find(this.adminClosedTasks, updatedTask)
            if(isClosed && !foundInClosedTasks)
              this.adminClosedTasks.push(updatedTask)
        
            if(!closed && !!foundInClosedTasks){
              console.log('hnaa 2...')
              this.adminClosedTasks = this.uT.filter(this.adminClosedTasks, updatedTask)
            }
          }

          if(!this.isAdmin){
            const isMyTask = (updatedTask.technicien == this.userId)
            const foundInClosedTasks = this.uT.find(this.techClosedTasks, updatedTask)
            
            if(isClosed && isMyTask && !foundInClosedTasks)
              this.techClosedTasks.push(updatedTask)
            if(!isClosed && !!foundInClosedTasks)
              this.techClosedTasks = this.uT.filter(this.techClosedTasks, updatedTask)
          }
        }
      })
  }// get closed tasks end

  
  // get all tasks start
  getAllTasks(){
    this.taskService
      .getTasks()
      .pipe(pluck('data'))
      .subscribe((tasks: Task[]) => {
        if(this.isAdmin)
          this.allAdminTasks = tasks
        if(!this.isAdmin){
          this.allTechTasks = tasks.filter((task: Task)=>
            task.technicien == this.userId)
        }
      })
    this.taskService
      .newTask$
      .subscribe((newTask: Task) => {
        if(newTask){
          if(this.isAdmin){
            const foundInAllTasks = this.uT.find(this.allAdminTasks, newTask)
            if(!foundInAllTasks)
              this.allAdminTasks.push(newTask)
          }
          if(!this.isAdmin){
            const foundInAllTasks = this.uT.find(this.allTechTasks, newTask)
            const isMyTask = (newTask.technicien == this.userId)
            if(!foundInAllTasks && isMyTask)
              this.allTechTasks.push(newTask)
          }
        }
      })
    this.taskService
      .updatedTask$
      .subscribe((updatedTask: Task) => {
        if(updatedTask){
          if(this.isAdmin){
            const foundInAllTasks = this.uT.find(this.allAdminTasks, updatedTask)
            if(!foundInAllTasks)
              this.allAdminTasks.push(updatedTask)
          }
          if(!this.isAdmin){
            const foundInAllTasks = this.uT.find(this.allTechTasks, updatedTask)
            const isMyTask = (updatedTask.technicien == this.userId)
            if(!foundInAllTasks && isMyTask)
              this.allTechTasks.push(updatedTask)
            if(!!foundInAllTasks && !isMyTask){
              console.log('hnaaaa')
              this.allTechTasks = this.uT.filter(this.allTechTasks, updatedTask)
            }
          }
        }
      })
  }


  getCurrentTasks(){
    this.taskService
      .getTasks()
      .pipe(pluck('data'))
      .subscribe((tasks: Task[]) => {
        if(this.isAdmin){
          this.adminCurrentTasks = tasks.filter((task: Task) => 
              (task.progres > 0 && task.progres < 100))
        }
        else{
          this.techCurrentTasks = tasks.filter((task: Task) =>
              (task.technicien == this.userId && task.progres > 0 && task.progres < 100))
        }
      })

    this.taskService
    .updatedTask$
    .subscribe((updatedTask: Task) => {
      if(updatedTask){
        const isCurrent = (updatedTask.progres > 0 && updatedTask.progres < 100)
        
        if(this.isAdmin){
          
          const foundInCurrentTasks = this.uT.find(this.adminCurrentTasks, updatedTask)
          
          if(isCurrent && !foundInCurrentTasks)
            this.adminCurrentTasks.push(updatedTask)
          if(!isCurrent && !!foundInCurrentTasks)
            this.adminCurrentTasks = this.uT.filter(this.adminCurrentTasks, updatedTask)
        }

        if(!this.isAdmin){

          const foundInCurrentTasks = this.uT.find(this.techCurrentTasks, updatedTask)
          const isMyTask = (updatedTask.technicien == this.userId)
          
          if(isCurrent && isMyTask && !foundInCurrentTasks)
            this.techCurrentTasks.push(updatedTask)
          if(!isCurrent && !!foundInCurrentTasks)
            this.techCurrentTasks = this.uT.filter(this.techCurrentTasks, updatedTask)
        }
      }
    })
  }

  getNewTasks(){
    this.taskService
      .getTasks()
      .pipe(pluck('data'))
      .subscribe((tasks: Task[]) => {
        if(this.isAdmin)
          this.adminNewTasks = tasks.filter((task: Task) => 
          (task.progres == 0))
        else
          this.techNewTasks = tasks.filter((task: Task) => 
            (task.progres == 0 && task.technicien == this.userId))

        console.log(`allNewTasks = ${this.adminNewTasks.length}`);
      })



    this.taskService
    .newTask$
    .subscribe((newTask: Task) => {
      if(newTask){  
        if(this.isAdmin){
          const foundInNewTasks = this.uT.find(this.adminNewTasks, newTask)
          
          if(!foundInNewTasks)
            this.adminNewTasks.push(newTask)
        }

        if(!this.isAdmin){

          const foundInNewTasks = this.uT.find(this.techNewTasks, newTask)
          const isMyTask = (newTask.technicien == this.userId)
          
          if(isMyTask && !foundInNewTasks)
            this.techNewTasks.push(newTask)
        }
      }
    })

    this.taskService
    .updatedTask$
    .subscribe((updatedTask: Task) => {
      if(updatedTask){
        const isNew = (updatedTask.progres == 0)
        
        if(this.isAdmin){
          
          const foundInNewTasks = this.uT.find(this.adminNewTasks, updatedTask)
          
          if(isNew && !foundInNewTasks)
            this.adminNewTasks.push(updatedTask)
          if(!isNew && !!foundInNewTasks)
            this.adminNewTasks = this.uT.filter(this.adminNewTasks, updatedTask)
        }

        if(!this.isAdmin){

          const foundInNewTasks = this.uT.find(this.techNewTasks, updatedTask)
          const isMyTask = (updatedTask.technicien == this.userId)
          
          if(isNew && isMyTask && !foundInNewTasks)
            this.techNewTasks.push(updatedTask)
          if(isNew && !isMyTask && !!foundInNewTasks)
            this.techNewTasks = this.uT.filter(this.techNewTasks, updatedTask)
        }
      }
    })
  }


  removeDeletedTasks(){
    this.taskService
      .deletedTask$
      .subscribe((deletedTaskId: string) => {
        if(deletedTaskId){
          if(this.isAdmin){
            const foundInClosedTasks = this.uT.findById(this.adminClosedTasks, deletedTaskId)
            const foundInNewTasks = this.uT.findById(this.adminNewTasks, deletedTaskId)
            const foundInAllTasks = this.uT.findById(this.allAdminTasks, deletedTaskId)
            const foundInCurrentTasks = this.uT.findById(this.adminCurrentTasks, deletedTaskId)
            
            if(!!foundInClosedTasks)
              this.adminClosedTasks = this.uT.filterById(this.adminClosedTasks, deletedTaskId)
            if(!!foundInNewTasks)
              this.adminNewTasks = this.uT.filterById(this.adminNewTasks, deletedTaskId)
            if(!!foundInAllTasks)
              this.allAdminTasks = this.uT.filterById(this.allAdminTasks, deletedTaskId)
            if(!!foundInCurrentTasks)
              this.adminCurrentTasks = this.uT.filterById(this.adminCurrentTasks, deletedTaskId)

          }

          if(!this.isAdmin){
            const foundInClosedTasks = this.uT.findById(this.techClosedTasks, deletedTaskId)
            const foundInNewTasks = this.uT.findById(this.techNewTasks, deletedTaskId)
            const foundInAllTasks = this.uT.findById(this.allTechTasks, deletedTaskId)
            const foundInCurrentTasks = this.uT.findById(this.techCurrentTasks, deletedTaskId)

            if(!!foundInClosedTasks)
              this.techClosedTasks = this.uT.filterById(this.techClosedTasks, deletedTaskId)
            if(!!foundInNewTasks)
              this.techNewTasks = this.uT.filterById(this.techNewTasks, deletedTaskId)
            if(!!foundInAllTasks)
              this.allTechTasks = this.uT.filterById(this.allTechTasks, deletedTaskId)
            if(!!foundInCurrentTasks)
              this.techCurrentTasks = this.uT.filterById(this.techCurrentTasks ,deletedTaskId)
          }
        }
      })
  }


  // // events
  // public chartClicked(e: any): void {
  // }
  // public chartHovered(e: any): void {
  // }

  ngOnInit() {
    this.getAllTasks()
    this.getNewTasks()
    this.getCurrentTasks()
    this.getClosedTasks()
    this.removeDeletedTasks()
  }
  
}
