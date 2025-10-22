import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, InputSignal, ViewChild } from '@angular/core';
import { Task } from '../../../shared/classes/task';
import { SubTask } from '../../../shared/classes/subTask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subtask',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent {
  task: InputSignal<Task> = input.required<Task>();
  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;

  /**
   * Enables the Edit-Mode of Subtask.
   * @param psubtask - Instance of SubTask.
   */
  private endbleEdit(psubtask: SubTask) {
    this.task().subtasks.forEach(subtask => {
      subtask.editMode = false;
      if (subtask.id == psubtask.id) subtask.editMode = true;
    });
  }

  private focusOnEdit() {
    if (this.editsub?.nativeElement) {
      const edsubEl = this.editsub.nativeElement;
      setTimeout(() => {
        edsubEl.focus();
        edsubEl.select();
        console.log('selected')
      }, 1000);
    } else {
      console.log('not exists');
    }
  }

  protected selectEditSub(subtask: SubTask) {
    this.endbleEdit(subtask);
    this.focusOnEdit();
  }
}