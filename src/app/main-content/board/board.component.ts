import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { ModalService } from '../../shared/services/modal.service';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { DisplaySizeService } from '../../shared/services/display-size.service';
import { ToastMsgService } from '../../shared/services/toast-msg.service';
import { Contact } from '../../shared/classes/contact';
import { Task } from '../../shared/classes/task';
import { SubTask } from '../../shared/classes/subTask';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { DisplayType } from '../../shared/enums/display-type.enum';
import { ContactObject } from '../../shared/interfaces/contact-object';
import { SubtaskObject } from '../../shared/interfaces/subtask-object';
import { TaskObject } from '../../shared/interfaces/task-object';
import { TaskColumnItemComponent } from '../../shared/components/task-column-item/task-column-item.component';
import { SearchTaskComponent } from '../../shared/components/search-task/search-task.component';
import { combineLatest, map, Subscription } from 'rxjs';

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
export class BoardComponent {
  // #region attributes

  protected modalService: ModalService = inject(ModalService);
  protected dss: DisplaySizeService = inject(DisplaySizeService);
  private tms: ToastMsgService = inject(ToastMsgService);
  private fireDB: FirebaseDBService = inject(FirebaseDBService);

  DisplayType = DisplayType;

  protected tasksSub!: Subscription;

  protected tasks: Task[] = [];
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
  protected taskItems: Task[][] = [[], [], [], []];

  // #endregion attributes

  constructor() {
    this.getData();
  }

  // #region methods

  // #region subscriptions

  private getData() {
    this.tasksSub = combineLatest([
      this.fireDB.contacts$(),
      this.fireDB.subtasks$(),
      this.fireDB.tasks$()
    ])
      .pipe(
        map(([contactsData, subtasksData, tasksData]) => {
          const contacts = contactsData.map(c => new Contact(c));
          const subtasks = subtasksData.map(s => new SubTask(s));

          const tasks = tasksData.map(t => {
            const task = new Task(t);
            task.contacts = contacts.filter(c => task.assignedTo.includes(c.id));
            task.subtasks = subtasks.filter(s => s.taskId === task.id);
            return task;
          });

          return tasks;
        })
      )
      .subscribe(tasks => {
        this.splitTasks2(tasks);
      });
  }
  
  private splitTasks2(tasks: Task[]) {
    this.taskItems = [[], [], [], []];
    for (const task of tasks) {
      switch (task.status) {
        case TaskStatusType.TODO:
          this.taskItems[0].push(task);
          break;
        case TaskStatusType.PROGRESS:
          this.taskItems[1].push(task);
          break;
        case TaskStatusType.REVIEW:
          this.taskItems[2].push(task);
          break;
        case TaskStatusType.DONE:
          this.taskItems[3].push(task);
      }
    }
  }

  protected async drop2(e: CdkDragDrop<Task[]>): Promise<void> {
    const previousList = e.previousContainer.data || [];
    const currentList = e.container.data || [];

    if (e.previousContainer != e.container) {
      transferArrayItem(previousList, currentList, e.previousIndex, e.currentIndex);
      currentList.sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
      if (this.taskItems[0].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.TODO;
      else if (this.taskItems[1].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.PROGRESS;
      else if (this.taskItems[2].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.REVIEW;
      else e.item.data.status = TaskStatusType.DONE;
      await this.updateTask(e.item.data);
    }
  }

  // #endregion subscriptions

  /**
   * Filters all Tasks by user input.
   * @param userSearch - Input from User-Searchbar.
   */
  protected filterTasks(userSearch: string) {
    this.shownTasks = userSearch.length == 0 ? this.tasks : this.tasks.filter(task => task.title.toLowerCase().includes(userSearch.toLowerCase()));
    this.splitTasks();
  }

  /**
   * Divides all shwohn Tasks in their lists
   */
  private splitTasks() {
    this.taskItems = [[], [], [], []];
    for (let i = 0; i < this.shownTasks.length; i++) {
      switch (this.shownTasks[i].status) {
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

  /**
   * Handles cdk drag and drop of task items. 
   * 
   * @param e cdk drag drop object
   */
  protected async drop(e: CdkDragDrop<Task[]>): Promise<void> {
    const previousList = e.previousContainer.data || [];
    const currentList = e.container.data || [];

    if (e.previousContainer != e.container) {
      transferArrayItem(previousList, currentList, e.previousIndex, e.currentIndex);
      currentList.sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
      if (this.taskItems[0].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.TODO;
      else if (this.taskItems[1].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.PROGRESS;
      else if (this.taskItems[2].some(task => task.id == e.item.data.id)) e.item.data.status = TaskStatusType.REVIEW;
      else e.item.data.status = TaskStatusType.DONE;
      await this.updateTask(e.item.data);
    }
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
}