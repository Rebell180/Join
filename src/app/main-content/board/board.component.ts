import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';
import { Task } from '../../shared/classes/task';
import { onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { Contact } from '../../shared/classes/contact';
import { SubTask } from '../../shared/classes/subTask';
import { ContactObject } from '../../shared/interfaces/contact-object';
import { SubtaskObject } from '../../shared/interfaces/subtask-object';
import { TaskObject } from '../../shared/interfaces/task-object';
import { ModalService } from '../../shared/services/modal.service';
import { TaskColumnItemComponent } from '../../shared/components/task-column-item/task-column-item.component';
import { CdkDragDrop, DragDropModule, transferArrayItem }from '@angular/cdk/drag-drop';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { ToastMsgService } from '../../shared/services/toast-msg.service';

@Component({
  selector: 'section[board]',
  standalone: true,
  imports: [
    SearchTaskComponent,
    CommonModule,
    TaskColumnItemComponent,
    DragDropModule
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements  OnDestroy, OnInit {
  // #region Attrbutes
  protected modalService: ModalService = inject(ModalService);
  private fireDB: FirebaseDBService = inject(FirebaseDBService);
  private tms: ToastMsgService = inject(ToastMsgService);

  // Primary Data
  tasks: Task[] = [];
  private shownTasks: Task[] = [];
  protected taskLists: {
    listName: string,
    status: TaskStatusType
  }[] = [
      { listName: 'To do', status: TaskStatusType.TODO },
      { listName: 'In progress', status: TaskStatusType.PROGRESS },
      { listName: 'Await feedback', status: TaskStatusType.REVIEW },
      { listName: 'Done', status: TaskStatusType.DONE }
    ]
  protected taskItems: Task[][] = [[],[],[],[]];

  // Database
  private contacts: Contact[] = [];
  private subtasks: SubTask[] = []
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
    return onSnapshot(this.fireDB.getCollectionRef('contacts'), contactsSnap => {
      this.contacts = [];
      contactsSnap.docs.map( doc => {this.contacts.push(new Contact(doc.data() as ContactObject))});
      this.sortContacts();
    });
  }

  /**
   * Subscribes the subtasks
   * @returns - Unsubscribe of Sutasks
   */
  private subscribeSubtasks(): Unsubscribe {
    return onSnapshot(this.fireDB.getCollectionRef('subtasks'), subtasksSnap => {
      this.subtasks = [];
      subtasksSnap.docs.map( doc => {this.subtasks.push(new SubTask(doc.data() as SubtaskObject))})
    })
  }

  /**
   * Subscribes the tasks.
   * @returns - Unsubscribe for Task
   */
  private subscribeTasks(): Unsubscribe {
    return onSnapshot(this.fireDB.getCollectionRef('tasks'), taskSnap => {
      this.tasks = [];
      this.shownTasks = [];
      taskSnap.docs.map( doc => {this.tasks.push(new Task(doc.data() as TaskObject))});
      for (let i = 0; i < this.tasks.length; i++) {
        this.addContactsToTask(i);
        this.addSubtasktoTask(i);
      }
      this.shownTasks = this.tasks;
      this.splitTasks();
      for (let i = 0; i < this.taskLists.length; i++) {
        this.sortTasks(i);
      }
    });
  }

  /**
   * Updates a task.
   * @param task - Task for update.
   */
  private async updateTask(task: Task) {
    await this.fireDB.taskUpdateInDB('tasks', task);
    this.tms.add('Task was updated', 3000, 'success');
  }
  // #endregion
  // #region taskmgmt
  /**
   * Filters all Tasks by user input.
   * @param userSearch - Input from User-Searchbar.
   */
  filterTasks(userSearch: string) {
    this.shownTasks = userSearch.length == 0 ? this.tasks : this.tasks.filter(task => task.title.toLowerCase().includes(userSearch.toLowerCase()));
    this.splitTasks();
  }

  /** Divides all shwohn Tasks in their lists */
  private splitTasks() {
    this.taskItems = [[], [], [], []];
    for (let i = 0; i < this.shownTasks.length; i++) {
      switch(this.shownTasks[i].status) {
        case TaskStatusType.TODO:
          this.taskItems[0].push(this.shownTasks[i]);
          break;
        case TaskStatusType.PROGRESS:
          this.taskItems[1].push(this.shownTasks[i]);
          break;
        case TaskStatusType.REVIEW:
          this.taskItems[2].push(this.shownTasks[i]);
          break;
        case TaskStatusType.DONE:
          this.taskItems[3].push(this.shownTasks[i]);
      }
    }
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
    this.tasks[index].contacts = [];
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
        if(!this.tasks[index].subtasks.includes(this.subtasks[i])) {
          this.tasks[index].subtasks.push(this.subtasks[i]);
        }
      }
    }
  }

  /**Sort contacts by  firstname, lastname. */
  private sortContacts(): void {
    this.contacts.sort((a, b) => {
      const firstCompare: number = a.firstname.localeCompare(b.firstname, 'de');
      if (firstCompare == 0) {
        return a.lastname.localeCompare(b.lastname, 'de');
      }
      return firstCompare;
    })
  }

  /**
   * Sort task of a task-list by dueDate ascending.
   * @param index - Index of task-list
   */
  private sortTasks(index: number): void {
    this.taskItems[index].sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
  }
  // #endregion

  protected drop(e: CdkDragDrop<Task[]>): void {
    const previousList = e.previousContainer.data || [];
    const currentList = e.container.data || [];

    if (e.previousContainer != e.container) {
      transferArrayItem(previousList, currentList, e.previousIndex, e.currentIndex);
      currentList.sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
      if (this.taskItems[0].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.TODO;
      else if (this.taskItems[1].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.PROGRESS;
      else if (this.taskItems[2].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.REVIEW;
      else e.item.data.status = TaskStatusType.DONE;
      this.updateTask(e.item.data);
    }
  }
  // #endregion
}