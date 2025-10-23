import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, inject, input, InputSignal, Renderer2, ViewChild } from '@angular/core';
import { Task } from '../../../shared/classes/task';
import { SubTask } from '../../../shared/classes/subTask';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { FirebaseDBService } from '../../../shared/services/firebase-db.service';

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
  protected newSubtask = new SubTask();
  private firstSub: SubTask | null = null;
  private secondSub: SubTask | null = null;

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  rd2: Renderer2 = inject(Renderer2);
  fsdb: FirebaseDBService = Inject(FirebaseDBService);
  fs: Firestore = inject(Firestore);

  @ViewChild('editsub') editsub!: ElementRef<HTMLInputElement>;
  @ViewChild('errmsg') errmsg!: ElementRef<HTMLParagraphElement>;

  /**
   * Enables the Edit-Mode of Subtask.
   * @param psubtask - Instance of SubTask.
   */
  private endbleEdit(psubtask: SubTask): void {
    let editEnabled: boolean = this.task().subtasks.every(subtask => !subtask.editMode)
    if (editEnabled) {
      this.sendErrMsg('');
      this.task().subtasks.forEach(subtask => {
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

  protected async createSubtask(event: Event): Promise<void> {
    event.preventDefault();
    if (this.newSubtask.name.length == 0) this.sendErrMsg('Name is required.');
    else if (this.countSubtaskName(this.newSubtask) > 0) this.sendErrMsg('Subtask allready exists.')
    else if (this.task().subtasks.length == 0) {
      this.sendErrMsg('');
      if (!this.firstSub) {
        await this.addSingleSubtask(this.newSubtask);
        this.sendErrMsg('Add another Subtask');
      } else {
        await this.addSingleSubtask(this.newSubtask);
      }
    } else {
      this.sendErrMsg('');
      await this.addSingleSubtask(this.newSubtask);
    }
  }

  private async addSingleSubtask(subtask: SubTask): Promise<void> {
    if (!this.task().hasSubtasks) await updateDoc(doc(this.fs, `tasks/${this.task().id}`), { hasTasks: true });
    subtask.taskId = this.task().id;
    const subid: DocumentReference = await addDoc(collection(this.fs, 'subtask'), subtask.toJSON());
    await updateDoc(subid, { id: subid.id });
    this.newSubtask = new SubTask();
  }

  /**
   * Renames as subtask.
   * @param event - Submit-Event.
   * @param subtask - Subaskt to rename.
   */
  protected async renameSubtask(event: Event, subtask: SubTask): Promise<void> {
    event.preventDefault();
    if (subtask.name.length == 0) this.sendErrMsg('New name is requrired.');
    else if (this.countSubtaskName(subtask) > 1) this.sendErrMsg('Subtask allreay exists.')
    else {
      this.sendErrMsg('');
      await updateDoc(doc(this.fs, `subtask/${subtask.id}`), subtask.toJSON());
      subtask.editMode = false;
    }
  }

  /**
   * Deletes a subtask.
   * @param subtask - Instance of Subtask.
   */
  protected async deleteSubtask(subtask: SubTask): Promise<void> {
    for (let i = 0; i < this.task().subtasks.length; i++) {
      if (this.task().subtasks[i].id == subtask.id) {
        subtask.editMode = false;
        await deleteDoc(doc(this.fs, `subtask/${subtask.id}`));
      }
    }
    if (this.task().subtasks.length == 1) {
      await updateDoc(doc(this.fs, `tasks/${subtask.id}`), { hasSubtasks: false })
    }
  }

  /**
   * Counts name of same subtask.
   * @param subtask - Instance of Subtask.
   * @returns - Number of same Subtask.
   */
  private countSubtaskName(subtask: SubTask): number {
    let counter: number = 0;
    if (!this.task().hasSubtasks) return 0;
    this.task().subtasks.forEach(cSubtask => {
      if (cSubtask.name == subtask.name) counter++;
    });
    return counter;
  }

}