import { Component } from '@angular/core';
import { AddtaskComponent } from "../../shared/components/add-task/add-task.component";

@Component({
  selector: 'app-add-task-container',
  imports: [AddtaskComponent],
  templateUrl: './add-task-container.component.html',
  styleUrl: './add-task-container.component.scss'
})
export class AddTaskContainerComponent {

}
