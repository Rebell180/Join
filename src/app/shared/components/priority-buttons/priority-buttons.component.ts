import { Component, input, InputSignal } from '@angular/core';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../classes/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-priority-buttons',
  imports: [CommonModule],
  templateUrl: './priority-buttons.component.html',
  styleUrl: './priority-buttons.component.scss'
})
export class PriorityButtonsComponent {
  task: InputSignal<Task> = input.required<Task>();

  Priority = Priority;
  protected setPriority(prio: Priority){
    this.task().priority = prio;
  }
}
