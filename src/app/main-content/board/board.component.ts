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
  private tasks: Task[] = [];
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

  // Database
  private fs: Firestore = inject(Firestore);
  private unsubTasks!: Unsubscribe;
  // #endregion

  ngOnInit(): void {
    this.unsubTasks = this.subscribeTasks( tasks => {
      this.tasks = tasks;
      this.shownTasks = tasks;
    });
  }

  ngOnDestroy(): void {
    this.unsubTasks();
  }

  // #region methods
  /**
   * Subscribes task-collection.
   *  @returns - Unsubscribe for tasks-collection
   */
  private subscribeTasks(callback: (tasks: Task[]) => void): Unsubscribe {
    const tasks: Task[] = [];
    return onSnapshot(collection(this.fs, 'tasks'), tasksnap => {
      tasksnap.docs.map(doc => tasks.push(this.mapTask(doc.data())));
      callback(tasks);
    });
  }
  
  /**
   * Creates a task.
   * @param obj - DataObject to map/
   * @returns - Instance of task.
   */
  private mapTask(obj:any) { return new Task(obj)}

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