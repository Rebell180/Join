import { Component, input, InputSignal } from '@angular/core';
import { Task } from '../../../shared/classes/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list-column',
  imports: [
    CommonModule
  ],
  templateUrl: './task-list-column.component.html',
  styleUrl: './task-list-column.component.scss'
})
export class TaskListColumnComponent {
  listName: InputSignal<string> = input.required<string>();
  tasks: InputSignal<Task[]> = input.required<Task[]>()
}
