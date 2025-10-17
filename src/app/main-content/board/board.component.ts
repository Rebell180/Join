import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';
import { Task } from '../../shared/classes/task';
import { collection, CollectionReference, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Priority } from '../../shared/enums/priority.enum';
import { Category } from '../../shared/enums/category.enum';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { TaskListColumnComponent } from './task-list-column/task-list-column.component';

interface TaskObject {
  id: string,
  title: string,
  category: Category,
  description: string,
  priority: Priority,
  dueDate: string,
  assignedTo: string[],
  subtasks: boolean,
  status: TaskStatusType
}

@Component({
  selector: 'section[board]',
  standalone: true,
  imports: [
    SearchTaskComponent,
    CommonModule,
    TaskListColumnComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  private tasks: Task[] = [];
  private shownTasks: Task[] = [];
  protected taskLists: {
    listName: string,
    status: TaskStatusType
  }[] = [
    {listName: 'To do', status: TaskStatusType.TODO},
    {listName: 'In progress', status: TaskStatusType.PROGRESS},
    {listName: 'Await feedback', status: TaskStatusType.REVIEW},
    {listName: 'Done', status: TaskStatusType.DONE}
  ]

  // Database
  fs: Firestore = inject(Firestore);
  unsubTasks!: Unsubscribe

  ngOnInit(): void {
    this.unsubTasks = this.subscribeTasks()
  }

  ngOnDestroy(): void {
    this.unsubTasks();
  }

  // #region database
  /**
   * Subscribes task-collection.
   *  @returns - Unsubscribe for tasks-collection
   */
  private subscribeTasks(): Unsubscribe {
    return onSnapshot(this.getTaskRef(), list => {
      list.forEach(element => {
        this.tasks.push(this.mapTask(element.data() as TaskObject));
      });
      this.shownTasks = this.tasks
    })
  }

  /**
   * Gets the task collection reference.
   * @returns - Collection-Reference for tasks.
   */
  private getTaskRef(): CollectionReference {
    return collection(this.fs, 'tasks');
  }

  /**
   * Maps result of database to a instance of task.
   * @param obj - Object from database.
   * @returns - Instance of Task.
   */
  private mapTask(obj: TaskObject): Task {
    return new Task(obj)
  }
  // #endregion

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
}
