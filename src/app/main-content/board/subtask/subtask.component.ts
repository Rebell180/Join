import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, input, InputSignal, ViewChild } from '@angular/core';
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
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;

  /**
   * Enables the Edit-Mode of Subtask.
   * @param psubtask - Instance of SubTask.
   */
  private endbleEdit(psubtask: SubTask): void {
    let editEnabled: boolean = this.task().subtasks.every(subtask => !subtask.editMode)
    if (editEnabled) {
      this.task().subtasks.forEach(subtask => {
        if (subtask.id == psubtask.id) subtask.editMode = true;
      });
    }
  }

  /** Sets focus on edit subtask input */
  private focusEdit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
      const el = this.editsub.nativeElement;
      el.focus();
      el.select();
    })
  }

  /**
   * Enables SubtaskEdit-Mode and sets focus on input-field.
   * @param subtask - Instance of SubTask.
   */
  protected selectEditInput(subtask: SubTask) {
    this.endbleEdit(subtask);
    this.focusEdit();
  }
}