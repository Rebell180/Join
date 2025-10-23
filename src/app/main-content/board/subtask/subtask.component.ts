import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, input, InputSignal, output, OutputEmitterRef, Renderer2, ViewChild } from '@angular/core';
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
  subtasks: InputSignal<SubTask[]> = input.required<SubTask[]>();
  outSubtasks: OutputEmitterRef<SubTask[]> = output<SubTask[]>()
  protected newSubtask = new SubTask();

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  rd2: Renderer2 = inject(Renderer2);

  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;
  @ViewChild('errmsg') errmsg!: ElementRef<HTMLParagraphElement>;

  /**
   * Enables the Edit-Mode of Subtask.
   * @param psubtask - Instance of SubTask.
   */
  private endbleEdit(psubtask: SubTask): void {
    let editEnabled: boolean = this.subtasks().every(subtask => !subtask.editMode)
    if (editEnabled) {
      this.sendErrMsg('');
      this.subtasks().forEach(subtask => {
        if (subtask.id == psubtask.id) subtask.editMode = true;
      });
    } else this.sendErrMsg('Edit another subtask at first.');
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
   * Sende an error message to UI.
   * @param msg - Message to send.
   */
  private sendErrMsg(msg: string): void {
    this.rd2.setProperty(this.errmsg.nativeElement, 'innerText', msg)
  }

  /**
   * Enables SubtaskEdit-Mode and sets focus on input-field.
   * @param subtask - Instance of SubTask.
   */
  protected selectEditInput(subtask: SubTask) {
    this.endbleEdit(subtask);
    this.focusEdit();
  }

  /**
   * Counts name of same subtask.
   * @param subtask - Instance of Subtask.
   * @returns - Number of same Subtask.
   */
  private countSubtaskName(subtask: SubTask): number {
    let counter: number = 0;
    this.subtasks().forEach(cSubtask => {
      if (cSubtask.name == subtask.name) counter++;
    });
    return counter;
  }

}