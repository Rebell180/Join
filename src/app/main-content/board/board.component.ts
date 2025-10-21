import { Component, inject, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';
import { Task } from '../../shared/classes/task';
import { collection, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { TaskListColumnComponent } from './task-list-column/task-list-column.component';
import { Contact } from '../../shared/classes/contact';
import { SubTask } from '../../shared/classes/subTask';
import { ContactObject, SubTaskObject, TaskObject } from '../../shared/interfaces/database-result';

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
    this.unsubTasks = this.subscribeTasks();
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

  private subscribeTasks(): Unsubscribe {
    return onSnapshot(collection(this.fs, 'tasks'), taskSnap => {
      taskSnap.docs.map( doc => {this.tasks.push(new Task(doc.data() as TaskObject))});
      for (let i = 0; i < this.tasks.length; i++) {
        this.addContactsToTask(i);
        this.addSubtasktoTask(i);
      }
      this.sortTasks();
      this.shownTasks = this.tasks;
    })
  }

  
  // #region taskmgmt
  /**
   * Filters all Tasks by user input.
   * @param userSearch - Input from User-Searchbar.
   */
  filterTasks(userSearch: string) {
    this.shownTasks = userSearch.length == 0 ? this.tasks : this.tasks.filter(task => task.title.toLowerCase().includes(userSearch.toLowerCase()));
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

  /**
   * Adds all contacts to a task.
   * @param index - Positon in Task-Array.
   */
  private addContactsToTask(index:number) {
    for (let i = 0; i < this.tasks[index].assignedTo.length; i++) {
      for (let j = 0; j < this.contacts.length; j++) {
        if (this.tasks[index].assignedTo[i] == this.contacts[j].id) {
          this.tasks[index].contacts.push(this.contacts[j]);
        }
      }
    }
  }

  /**
   * Adds all subtasks to a task.
   * @param index - Position in Task-Array.
   */
  private addSubtasktoTask(index: number) {
    for (let i = 0; i < this.subtasks.length; i++) {
      if (this.tasks[index].hasSubtasks && this.subtasks[i].taskId == this.tasks[index].id) {
        this.tasks[index].subtasks.push(this.subtasks[i]);
      }
    }
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

  /** Sorts Task-list by Due-Date ascending. */
  private sortTasks() {
    this.tasks.sort((a, b) => a.dueDate.seconds - b.dueDate.seconds)
  }
  // #endregion
  // #endregion
}