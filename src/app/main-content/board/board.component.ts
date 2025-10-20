import { Component, inject, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';
import { Task } from '../../shared/classes/task';
import { collection, CollectionReference, doc, DocumentData, DocumentReference, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Priority } from '../../shared/enums/priority.enum';
import { Category } from '../../shared/enums/category.enum';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { TaskListColumnComponent } from './task-list-column/task-list-column.component';
import { Contact } from '../../shared/classes/contact';
import { SubTask } from '../../shared/classes/subTask';

@Component({
  selector: 'section[board]',
  standalone: true,
  imports: [
    SearchTaskComponent,
    CommonModule,
    TaskListColumnComponent,    
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {
  // #region Attrbutes
  // Primary Data
  private tasks: Task[] = [];
  private shownTasks: Task[] = [];
  private contacts: Contact[] = [];
  private subtasks: SubTask[] = [];
  protected taskLists: {
    listName: string,
    status: TaskStatusType
  }[] = [
      { listName: 'To do', status: TaskStatusType.TODO },
      { listName: 'In progress', status: TaskStatusType.PROGRESS },
      { listName: 'Await feedback', status: TaskStatusType.REVIEW },
      { listName: 'Done', status: TaskStatusType.DONE }
    ]

  // Database
  private fs: Firestore = inject(Firestore);
  private unsubTasks!: Unsubscribe;
  private unsubContacts!: Unsubscribe;
  private unsubSubtasks!: Unsubscribe;
  // #endregion

  ngOnInit(): void {
    this.unsubContacts = this.subscribeContacts();
  }

  ngOnDestroy(): void {
    this.unsubTasks();
  }

  // #region methods
  // #region database
  
  private subscribeContacts(): Unsubscribe {
    return onSnapshot(collection(this.fs, 'contacts'), contactsSnap => {
      contactsSnap.docs.map( doc => {this.contacts.push(this.mapContact(doc.data()))})
    })
  }

  /**
   * Createte a contact.
   * @param obj - Object from Database
   * @returns Instance of contact.
   */
  private mapContact(obj: any): Contact {return new Contact(obj);}
  /**
   * Creates a task.
   * @param obj - DataObject to map/
   * @returns - Instance of task.
   */
  private mapTask(obj:any) { return new Task(obj)}
  // #endregion

  // #region taskmgmt
  /**
   * Filters all Tasks by user input.
   * @param userSearch - Input from User-Searchbar.
   */
  filterTasks(userSearch: string) {
    this.shownTasks = userSearch.length == 0 ? this.tasks : this.tasks.filter(task => task.title.includes(userSearch));
  }

  /** Gets all Tasks, which has been searched.
   * If user is not looking for tasks, all tasks are schown.
   */
  getTasks() {
    return this.shownTasks;
  }

  /**
   * Gets tasks from status.
   * @param status - State of Task
   * @returns - separete List for status
   */
  getTaskForList(status: TaskStatusType): Task[] {
    return this.shownTasks.filter(task => task.status == status)
  }
  // #endregion
  // #endregion
}