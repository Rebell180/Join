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
import { CategoryDropComponent } from "../category-drop/category-drop.component";


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityButtonsComponent, DatePickerComponent, AssignContactsComponent, SubtaskComponent, CategoryDropComponent],
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
   * Adds a task into Database. 
   */
  protected async addTask(): Promise<void> {
    await this.fireDB.taskAddToDB('tasks', this.currentTask());
    this.cdr.detectChanges();
    this.clear();
  }

  /**
   * Updates existing task in DB
   */
  protected async updateTask(): Promise<void> {
    await this.fireDB.taskUpdateInDB('tasks', this.currentTask());
    this.closeModal();
    // this.tms.add('Task was updated', 3000, 'success');
  }

  /**
   * Reset all inputs to default.
   */
  clear() {
    this.currentTask().title = '';
    this.currentTask().description = '';
    this.currentTask().category = Category.TASK;
    this.currentTask().priority = Priority.MEDIUM;
    this.currentTask().dueDate = Timestamp.fromMillis(
	    Timestamp.now().toMillis() + (24 * 60 * 60 * 1000)
	  );
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
   * 
   * @param category 
   */
  updateCategory(category: Category) {
    this.currentTask().category = category;
  }

  /**
   * Sets the submitted subtasks to task subTasks.
   * @param subtasks 
   */
  updateSubtasks(subtasks: Array<SubTask>) {
    this.currentTask().subtasks = [];
    subtasks.forEach((subtask) => {
      if(subtask.taskId == ''){
        subtask.taskId = this.currentTask().id;
      }
      this.currentTask().subtasks.push(subtask);
    });
    this.currentTask().hasSubtasks = this.currentTask().subtasks.length >= 1;
  }

  /**
   * if this component is part of a modal
   * this method emits a close output which can handle by parent.
   */
  closeModal() {
    this.close.emit(true);
  }
  // #endregion methods
}