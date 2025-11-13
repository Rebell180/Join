import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, input, InputSignal, output, OutputEmitterRef, Renderer2, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SubTask } from '../../classes/subTask';
import { FormsModule } from '@angular/forms';
import { SubtaskEditState } from '../../enums/subtask-edit-state';
import { ValidationFields } from '../../enums/validation-fields';
import { ValidationService } from '../../services/validation.service';
import { ErrorMsgService } from '../../services/error-msg.service';
import { ToastMsgService } from '../../services/toast-msg.service';

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
  protected editSubtask = new SubTask();
  protected SubtaskEditState = SubtaskEditState;
  protected ValidationFields = ValidationFields;

  vds: ValidationService = inject(ValidationService);
  ems: ErrorMsgService = inject(ErrorMsgService);
  tms: ToastMsgService = inject(ToastMsgService);
  

  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;
  @ViewChild('errmsg') errmsg!: ElementRef<HTMLParagraphElement>;
  
  // #endregion attributes

  constructor(private elementRef: ElementRef) {}

  private _docClickListener: ((evt: Event) => void) | null = null;

  ngOnInit(): void {
    this._docClickListener = (event: Event) => {
      const target = event.target as Node | null;
      if (target && !this.elementRef.nativeElement.contains(target)) {
        const activeSubtasks = this.subtasks().filter(subtask => subtask.editMode);
        activeSubtasks.forEach((subtask) => {
          subtask.editMode = false;
        });
        this.newSubtask.editMode = false;
        this.outSubtasks.emit(this.subtasks());
      }
      this.ems.setErrorMsg(ValidationFields.SUBTASK, '');
      this.vds.formValidSubtask();
    };
    document.addEventListener('click', this._docClickListener, true);
  }

  ngOnDestroy(): void {
    if (this._docClickListener) {
      document.removeEventListener('click', this._docClickListener, true);
      this._docClickListener = null;
    }
  }

  // #region methods

  // #region CRUD

  /**
   * Adds a valid subtask to array and emits output.
   */
  addSub() {
    this.vds.validateSubTasksWithNew(this.newSubtask.name.trim(), this.subtasks());
    if(this.ems.subtaskErrorMsg() == '' && this.newSubtask.name.trim().length > 1) {
      this.newSubtask.editMode = false;
      this.newSubtask.editState = SubtaskEditState.NEW;
      const allSubtasks = this.subtasks();
      allSubtasks.push(this.newSubtask);
      this.outSubtasks.emit(allSubtasks);
      this.newSubtask = new SubTask();
      this.validateSubtaskList();
    } else if(this.newSubtask.name.trim().length < 2){
      this.ems.setErrorMsg(ValidationFields.SUBTASK, 'Minimum of 2 letters needed.');
    } else {
      this.tms.add('Could not add subtask.');
    }
  }

  /**
   * Updates an existing subtask. 
   * 
   * @param index index of subtask array.
   */
  updateSub(index: number): void {
    console.log(this.editSubtask);
    console.log(this.subtasks());
    this.vds.validateSubTasksWithNew(this.editSubtask.name.trim(), this.subtasks());
    if(this.ems.subtaskErrorMsg() == '' && this.editSubtask.name.trim().length > 1) {
      const allSubtasks = this.subtasks();
      allSubtasks[index].name = this.editSubtask.name.trim();
      allSubtasks[index].editMode = false;
      allSubtasks[index].editState = SubtaskEditState.CHANGED;
      this.outSubtasks.emit(allSubtasks);
      this.validateSubtaskList();
    } else if(this.editSubtask.name.trim().length < 2) {
      this.ems.setErrorMsg(ValidationFields.SUBTASK, 'Minimum of 2 letters needed.');
    } else {
      this.tms.add('Could not update subtask.');
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
    this.vds.validateSubTasksWithNew(this.subtasks()[index].name, this.subtasks());
    this.validateSubtaskList();
  }

  // #endregion CRUD

  // #region helper

  /**
   * Enables SubtaskEdit-Mode and sets focus on input-field.
   * @param index - Index of subtaskarray
   */
  protected selectEditInput(index: number) {
    this.editSubtask = { ...this.subtasks()[index]} as SubTask;
    console.log(this.editSubtask);
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
      // this.cdr.detectChanges();
      const el = this.editsub.nativeElement;
      el.focus();
      el.select();
    })
  }

  /**
   * Validate hole subtask list.
   */
  private validateSubtaskList() {
    let activeSubtasks = this.subtasks().filter((subtask) => subtask.editState != SubtaskEditState.DELETED);
    if (activeSubtasks.length <= 1) {  
      this.ems.subtaskErrorMsg.set('Add another task');
    } else {
      this.ems.subtaskErrorMsg.set('');
    }
  }

  // #endregion helper
  
  // #endregion methods
}