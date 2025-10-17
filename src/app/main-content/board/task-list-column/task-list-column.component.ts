import { Component, input, InputSignal } from '@angular/core';
import { Task } from '../../../shared/classes/task';

@Component({
  selector: 'app-task-list-column',
  imports: [],
  templateUrl: './task-list-column.component.html',
  styleUrl: './task-list-column.component.scss'
})
export class TaskListColumnComponent {
  listName: InputSignal<string> = input.required<string>();
  tasks: InputSignal<Task[]> = input.required<Task[]>()
}
