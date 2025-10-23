import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, input, InputSignal, OnInit, output, OutputEmitterRef, Renderer2, ViewChild } from '@angular/core';
import { SubTask } from '../../../shared/classes/subTask';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../shared/classes/task';
import { SubtaskEditState } from '../../../shared/enums/subtask-edit-state';

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

  // #region Methods
  // #region Form
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
  // #endregion

  // #region CRUD
  /**
   * Adds a Subtaksk.
   * @param e - Submit-Event from form.
   */
  add(e: Event): void {
    e.preventDefault();
    this.newSubtask.editState = SubtaskEditState.NEW;
    if (this.newSubtask.name.length == 0) this.sendErrMsg('Name is required.');
    else if (this.countSubtaskName(this.newSubtask) > 0) this.sendErrMsg('Subtask already exists.');
    else {
      this.subtasks().push(this.newSubtask);
      this.newSubtask = new SubTask();
      if (this.subtasks().length < 2) this.sendErrMsg('Add another Subtask.');
      else this.outSubtasks.emit(this.subtasks());
    }
  }

  /**
   * Chenge the name of subtask.
   * @param e - Submit-Event from form.
   * @param index - Indes of subtask-aray.
   */
  changeName(e: Event, index:number) {
    e.preventDefault();
    if (this.subtasks()[index].name.length == 0) this.sendErrMsg('New name required.');
    else if (this.countSubtaskName(this.subtasks()[index]) > 1) this.sendErrMsg('Subtask allready exists.');
    else {
      if (this.subtasks()[index].editState == SubtaskEditState.NONE) this.subtasks()[index].editState = SubtaskEditState.CHANGED;
      this.subtasks()[index].editMode = false;
      this.outSubtasks.emit(this.subtasks())
    }
  }
  // #endrgion
  // #endregion
}