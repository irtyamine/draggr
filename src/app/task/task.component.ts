import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { TimeIncrementService } from '../time-increment.service';

import { Task } from '../task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

	@Input() task: Task;
	public style: Object = {};

  previousHeight: number;
  
  constructor(private incService: TimeIncrementService, private renderer: Renderer2) {}

  ngOnInit() {
    this.previousHeight = ((this.task.time/15)*32)-6;
  }

  onResizing(event: ResizeEvent): void {
    if (event.rectangle.height < this.previousHeight){
      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date);
      this.incService.moveTask(proposedTask, proposedTask.date);
      if (this.incService.moveSuccessful){
        this.incService.unoccupyLastTime(this.task, this.task.date);
        this.task.time = ((event.rectangle.height+6)/32) * 15;
        this.style = {
          height: `${event.rectangle.height}px`
        }
      }
      
    }

    if (event.rectangle.height > this.previousHeight){
      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date);
      this.incService.moveTask(proposedTask, proposedTask.date);
      console.log(this.incService.moveSuccessful);
      if (this.incService.moveSuccessful){
            this.style = {
              height: `${event.rectangle.height}px`
            }
            this.task.time = ((event.rectangle.height+6)/32) * 15;
            this.incService.initTimes(this.task, this.task.date);
      }

    }


    this.previousHeight = event.rectangle.height;
    
  }
}
