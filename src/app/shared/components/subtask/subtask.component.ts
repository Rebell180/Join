import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, input, InputSignal, output, OutputEmitterRef, Renderer2, ViewChild } from '@angular/core';
import { SubTask } from '../../classes/subTask';
import { FormsModule } from '@angular/forms';
import { SubtaskEditState } from '../../enums/subtask-edit-state';

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
  // #region Attributes

  subtasks: InputSignal<SubTask[]> = input.required<SubTask[]>();
  outSubtasks: OutputEmitterRef<SubTask[]> = output<SubTask[]>()
  protected newSubtask = new SubTask();
  protected SubtaskEditState = SubtaskEditState;

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  rd2: Renderer2 = inject(Renderer2);

  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;
  @ViewChild('errmsg') errmsg!: ElementRef<HTMLParagraphElement>;
  
  // #endregion attributes

  constructor(private elementRef: ElementRef) {}

  // #region methods

  // #region CRUD

  /**
   * Adds a valid subtask to array and emits output.
   */
  addSub() {
    if(this.validateSubtask(this.newSubtask)) {
      this.newSubtask.editMode = false;
      this.newSubtask.editState = SubtaskEditState.NEW;
      const allSubtasks = this.subtasks();
      allSubtasks.push(this.newSubtask);
      this.outSubtasks.emit(allSubtasks);
      this.newSubtask = new SubTask();
      this.validateSubtaskList();
    }
  }

  /**
   * Updates an existing subtask. 
   * 
   * @param index index of subtask array.
   */
  updateSub(index: number): void {
    if(this.validateSubtask(this.subtasks()[index])) {
      const allSubtasks = this.subtasks();
      allSubtasks[index].editMode = false;
      allSubtasks[index].editState = SubtaskEditState.CHANGED;
      this.outSubtasks.emit(allSubtasks);
      this.validateSubtaskList();
    }
  }

  /**
   * Deletes a subtask.
   * 
   * @param index - Index of subtask array.
   */
  deleteSub(index: number): void {
    const allSubtasks = this.subtasks();
    allSubtasks[index].editMode = false;
    allSubtasks[index].editState = SubtaskEditState.DELETED;
    this.outSubtasks.emit(allSubtasks);
    this.validateSubtaskList();
  }

  // #endregion CRUD

  // #region helper

  /**
   * Enables SubtaskEdit-Mode and sets focus on input-field.
   * @param index - Index of subtaskarray
   */
  protected selectEditInput(index: number) {
    this.endbleEditMode(index);
    this.focusEdit();
  }

  /**
   * Resets input of submitted subtask.
   * 
   * @param index index of subtask element.
   */
  protected reset(index: number): void {
    if( index == -1 ) {
      this.newSubtask.name = '';
    }
    else {
      this.subtasks()[index].name = '';
    }
  }

  /**
   * Enables submitted edit mode and deactivate all others.
   * 
   * @param index index of input to enable.
   */
  protected endbleEditMode(index: number) {
    const allSubtasks = this.subtasks();
    allSubtasks.forEach((subtask) => {
      subtask.editMode = false
    })
    this.newSubtask.editMode = false;

    if( index == -1 ) {
      this.newSubtask.editMode = true;
    }
    else {
      allSubtasks[index].editMode = true;
    }
    this.outSubtasks.emit(allSubtasks);
  }

  /** 
   * Sets focus on edit subtask input. 
   */
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
   * Counts name of same subtask.
   * @param subtask - Instance of Subtask.
   * @returns - Number of same Subtask.
   */
  private countSubtaskName(subtask: SubTask): number {
    let counter: number = 0;
    this.subtasks().forEach(cSubtask => {
      if (cSubtask.name == subtask.name && cSubtask.editState != SubtaskEditState.DELETED){
        counter++;
      } 
    });
    return counter;
  }

  /**
   * Validate the submitted subtask.
   * 
   * @param subtask subtask to validate
   * @returns @boolean if subtask is valid
   */
  private validateSubtask(subtask: SubTask): boolean {
    if (subtask.name.length == 0) {
      this.sendErrMsg('Name is required.');
      return false;
    }
    
    if (this.countSubtaskName(subtask) > 0) {
      this.sendErrMsg('Subtask already exists.');
      return false;
    }
    this.sendErrMsg('');
    return true;
  }

  /**
   * Validate hole subtask list.
   */
  private validateSubtaskList() {
    let activeSubtasks = this.subtasks().filter((subtask) => subtask.editState != SubtaskEditState.DELETED);
    if (activeSubtasks.length <= 1) {  
      this.sendErrMsg('Add another Subtask.');
    }
  }

  /**
   * Click event of onClick outside of content to close pop up.
   * 
   * @param event click event on outside of content.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      event.preventDefault();
      const activeSubtasks = this.subtasks().filter(subtask => subtask.editMode);
      activeSubtasks.forEach((subtask) => {
        subtask.editMode = false;
      })
      this.newSubtask.editMode = false;
    }
  }

  // #endregion helper
  
  // #endregion methods
}