import { ChangeDetectorRef, Component, inject, input, InputSignal, OnDestroy, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseDBService } from '../../services/firebase-db.service';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../classes/task';
import { CommonModule } from '@angular/common';
import { PriorityButtonsComponent } from "../priority-buttons/priority-buttons.component";
import { Category } from '../../enums/category.enum';
import { query, Unsubscribe, where, Query, onSnapshot, Timestamp, Firestore, collection, CollectionReference, addDoc, updateDoc } from '@angular/fire/firestore';
import { Contact } from '../../classes/contact';
import { DatePickerComponent } from "../date-picker/date-picker.component";
import { AssignContactsComponent } from "../assign-contacts/assign-contacts.component";
import { ToastMsgService } from '../../services/toast-msg.service';
import { SubtaskComponent } from '../subtask/subtask.component';
import { SubtaskEditState } from '../../enums/subtask-edit-state';
import { SubTask } from '../../classes/subTask';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityButtonsComponent, DatePickerComponent, AssignContactsComponent, SubtaskComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddtaskComponent implements OnDestroy {

  // #region properties

  fireDB: FirebaseDBService = inject(FirebaseDBService);
  fs: Firestore = inject(Firestore);
  tms: ToastMsgService = inject(ToastMsgService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  Priority = Priority;
  Category = Category;

  currentTask: InputSignal<Task> = input.required<Task>();
  close: OutputEmitterRef<boolean> = output<boolean>();
  contacts: Array<Contact> = []

  unsubContacts: Unsubscribe;

  // #endregion properties
  
  constructor() {
    this.unsubContacts = this.getContactsSnapshot();
  }

  ngOnDestroy() {
    this.unsubContacts();
  }

  // #region methods

  /**
   * Opens a two way data stream between code and firebase collection 'contacts'.
   * 
   * @returns an @type Unsubscribe.
   */
  private getContactsSnapshot(): Unsubscribe {
    const q: Query = query(this.fireDB.getCollectionRef('contacts'), where('id', '!=', ''));
  
    return onSnapshot(q, (list) => {
      this.contacts = [];
      list.forEach((docRef) => {
        this.contacts.push(this.fireDB.mapResponseToContact({ ...docRef.data(), id: docRef.id}));
      });
    });
  }

  /**
   * Submit the entered data as new Task to DB
   *  
   * @param e event
   */
  async submitForm(e: SubmitEvent) {
    if(this.currentTask().id == '') {
      await this.addTask();
      this.clear();
      this.tms.add('Task was created', 3000, 'success');
    } else {
      await this.updateTask();
    }
    this.closeModal();
  }
  
  /** Adds a task into Database. */
  private async addTask(): Promise<void> {
    const refTask: CollectionReference = collection(this.fs, 'tasks');
    const taskDocRef = await addDoc(refTask, this.currentTask().toJSON());
    await updateDoc(taskDocRef, {id: taskDocRef.id});
    for (let i = 0; i < this.currentTask().subtasks.length; i++) {
      this.currentTask().subtasks[i].taskId = taskDocRef.id;
      await this.addSubtask(this.currentTask().subtasks[i]);
    }
    this.cdr.detectChanges();
  }
  
  /**
   * Adds Subtask in Database.
   * @param subtask - Instance of Subtask.
   */
  private async addSubtask(subtask: SubTask): Promise<void> {
    const refSubtask: CollectionReference = collection(this.fs, 'subtasks');
    const subtaskDocRef = await addDoc(refSubtask, subtask.toJSON());
    await updateDoc(subtaskDocRef, {id: subtaskDocRef.id});
  }

  /**
   * Updates existing task in DB
   */
  async updateTask() {
    await this.fireDB.taskUpdateInDB('tasks', this.currentTask());
    this.closeModal();
    this.tms.add('Task was updated', 3000, 'success');
  }

  /**
   * Reset all inputs to default.
   */
  clear() {
    this.currentTask().title = '';
    this.currentTask().description = '';
    this.currentTask().category = Category.TASK;
    this.currentTask().priority = Priority.MEDIUM;
    this.currentTask().dueDate = Timestamp.now();
    this.currentTask().subtasks = []
    this.currentTask().hasSubtasks = false;
    this.updateContacts([]);
    this.contacts.forEach(contact => {
      contact.isChecked = false;
    });
  }

  /**
   * Sets the due date of task. 
   * 
   * @param date selected date from date-picker
   */
  setDate(date: Date) {
    this.currentTask().dueDate = Timestamp.fromDate(date)
  }

  /**
   * Sets the chosen contacts to task contacts.
   * 
   * @param chosenContacts Array<Contact> with selected contacts
   */
  updateContacts(chosenContacts: Array<Contact>) {
    this.currentTask().contacts = chosenContacts;
    this.currentTask().assignedTo = [];
    chosenContacts.forEach((contact) => {
      this.currentTask().assignedTo.push(contact.id);
    })
  }

  /**
   * Sets the submitted subtasks to task subTasks.
   * @param subtasks 
   */
  updateSubtasks(subtasks: Array<SubTask>) {
    subtasks.forEach((subtask) => {
      if(subtask.taskId == ''){
        subtask.taskId = this.currentTask().id;
      }
    });
    this.currentTask().subtasks = subtasks;
    this.currentTask().hasSubtasks = this.currentTask().subtasks.length >= 1;
  }

  closeModal() {
    this.close.emit(true);
  }
  // #endregion methods
}