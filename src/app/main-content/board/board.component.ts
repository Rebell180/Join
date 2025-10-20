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
import { ContactObject, SubTaskObject } from '../../shared/interfaces/database-result';

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
    this.unsubSubtasks = this.subscribeSubtasks();
  }

  ngOnDestroy(): void {
    this.unsubContacts();
    this.unsubSubtasks();
    this.unsubTasks();
  }

  // #region methods
  // #region database
  /**
   * Subscribes the contacts.
   * @returns - Unsubscribe of Contacts.
   */
  private subscribeContacts(): Unsubscribe {
    return onSnapshot(collection(this.fs, 'contacts'), contactsSnap => {
      contactsSnap.docs.map( doc => {this.contacts.push(new Contact(doc.data() as ContactObject))});
      this.sortContacts();
    });
  }

  /**
   * Subscribes the subtasks
   * @returns - Unsubscribe of Sutasks
   */
  private subscribeSubtasks(): Unsubscribe {
    return onSnapshot(collection(this.fs, 'subtask'), subtasksSnap => {
      subtasksSnap.docs.map( doc => {this.subtasks.push(new SubTask(doc.data() as SubTaskObject))})
    })
  }

  
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

  /**Sort contacts by  firstname, lastname. */
  private sortContacts() {
    this.contacts.sort((a, b) => {
      const firstCompare: number = a.firstname.localeCompare(b.firstname, 'de');
      if (firstCompare == 0) {
        return a.lastname.localeCompare(b.lastname, 'de');
      }
      return firstCompare;
    })
  }


  // #endregion
  // #endregion
}