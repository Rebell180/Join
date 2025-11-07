import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output, } from '@angular/core';
import { onSnapshot, Timestamp, Unsubscribe } from '@angular/fire/firestore';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { Task } from '../../shared/classes/task';
import { TaskObject } from '../../shared/interfaces/task-object';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { CommonModule } from '@angular/common';
import { Priority } from '../../shared/enums/priority.enum';
import { SectionType } from '../../shared/enums/section-type';

@Component({
  selector: 'section[summary]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summmary.component.html',
  styleUrls: ['./summmary.component.scss']
})
export class SummmaryComponent implements OnInit, OnDestroy {
//Attribute
private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
@Output() selectedSection = new EventEmitter<SectionType>();

Priority = Priority;

goToBoard(): void {
  this.selectedSection.emit(SectionType.BOARD);
}

/**
 * Holds the unsubscribe function for the Firestore tasks snapshot listener.
 * @private
 */
private unsubTasks!: Unsubscribe;

todoCount: number = 0;
progressCount: number = 0;
reviewCount: number = 0;
doneCount: number = 0;

totalTasks: number = 0;
sortedTasks: Task[] = [];
//endregion


//constructor
/**
 * Creates the TaskSummaryComponent.
 * @param fireDB - Service used to interact with Firestore.
 */
constructor(
    private fireDB: FirebaseDBService
  ) {}
//endregion

//#region ngOnInit/ngOnDestroy
/**
 * Lifecycle hook called after component initialization.
 * Subscribes to the tasks status count and triggers change detection after a short delay.
 */
ngOnInit(): void {
  this.subscribeTasksStatusCount();
  setTimeout(() => {
    this.cdr.detectChanges();
  }, 1000);
}

/**
 * Lifecycle hook called before the component is destroyed.
 * Ensures the tasks subscription is unsubscribed to avoid memory leaks.
 */
ngOnDestroy(): void {
  if (this.unsubTasks) this.unsubTasks();
}
//#endregion


//#region subscribeTasksStatusCount
/**
 * Subscribes to the Firestore 'tasks' collection snapshot.
 * Updates task lists, status counts, priority counts, and recalculates highest priority on each change.
 * @private
 */
private subscribeTasksStatusCount(): void {
  this.unsubTasks = onSnapshot(this.fireDB.getCollectionRef('tasks'), snapshot => {
    const tasks: Task[] = snapshot.docs.map(doc => new Task(doc.data() as TaskObject));

    this.sortedTasks = this.getNextTasks(tasks);

    this.updateStatusCounts(tasks);

    this.cdr.detectChanges();
  });
}
//#endregion


//#region updateStatusCounts
/**
 * Updates the count of tasks in each status category.
 * @param tasks - Array of Task objects to calculate counts from.
 * @private
 */
private updateStatusCounts(tasks: Task[]): void {
  this.todoCount = tasks.filter(t => t.status === TaskStatusType.TODO).length;
  this.progressCount = tasks.filter(t => t.status === TaskStatusType.PROGRESS).length;
  this.reviewCount = tasks.filter(t => t.status === TaskStatusType.REVIEW).length;
  this.doneCount = tasks.filter(t => t.status === TaskStatusType.DONE).length;
  this.totalTasks = tasks.length;
}
//#endregion


  //#region getNextTasks
  /**
   * Returns the next set of tasks to be processed, based on their due date and priority.
   * 
   * The method first finds the lowest (earliest) due date among all given tasks,
   * filters tasks that share this date, and then sorts them by priority 
   * (URGENT → MEDIUM → LOW).
   * 
   * @private
   * @param {Task[]} tasks - The list of tasks to process.
   * @returns {Task[]} - A sorted array of the next tasks to be handled.
   */
  private getNextTasks(tasks: Task[]): Task[] {
    if (tasks.length === 0) return [];

    let sortedTasks: Array<Task> = [];

    let lowestDate = this.getLowestDueDate(tasks);

    let filteredTasks: Task[] = this.filterTasksLowestDate(tasks, lowestDate);

    if (filteredTasks.length == 0) return [];

    let priorityTasks = this.filterPriority(filteredTasks);

    priorityTasks.forEach(task => sortedTasks.push(task));

    return sortedTasks;
  }
  //#endregion


  //#region getLowestDueDate
  /**
   * Determines the lowest (earliest) due date among a list of tasks.
   * 
   * Tasks with the status `DONE` are ignored.
   * 
   * @private
   * @param {Task[]} tasks - The list of tasks to inspect.
   * @returns {Timestamp} - The earliest due date found.
   */
  private getLowestDueDate(tasks: Task[]): Timestamp {
    let lowestDate = Timestamp.fromMillis(
      Timestamp.now().toMillis() + (24 * 60 * 60 * 1000 * 365)
    );

    tasks.forEach((task) => {
      if (task.dueDate.seconds < lowestDate.seconds && task.status != TaskStatusType.DONE) {
        lowestDate = task.dueDate;
      }
    });

    return lowestDate;
  }
  //#endregion


  //#region filterTasksLowestDate
  /**
   * Filters all tasks that have the same due date as the provided lowest date.
   * 
   * @private
   * @param {Task[]} tasks - The list of tasks to filter.
   * @param {Timestamp} lowestDate - The lowest due date to match.
   * @returns {Task[]} - A list of tasks with the same due date as the lowest date.
   */
  private filterTasksLowestDate(tasks: Task[], lowestDate: Timestamp): Task[] {
    return tasks.filter(task => task.dueDate.seconds == lowestDate.seconds);
  }
  //#endregion


  //#region filterPriority
  /**
   * Filters and sorts tasks by priority.
   * 
   * If multiple tasks share the same due date, the method prioritizes tasks as follows:
   * 1. URGENT
   * 2. MEDIUM
   * 3. LOW
   * 
   * Only tasks with the highest available priority level among the filtered list are returned.
   * 
   * @private
   * @param {Task[]} filteredTasks - The tasks that share the same lowest due date.
   * @returns {Task[]} - A sorted list of tasks by priority.
   */
  private filterPriority(filteredTasks: Task[]): Task[] {
    const sortedTasks: Task[] = [];

    if (filteredTasks.length == 1) {
      sortedTasks.push(filteredTasks[0]);
    } else {
      if (filteredTasks.filter(task => task.priority == Priority.URGENT).length >= 1) {
        filteredTasks.filter(task => task.priority == Priority.URGENT).forEach(task => {
          sortedTasks.push(task);
        });
        console.log('URGENT');
      } else if (filteredTasks.filter(task => task.priority == Priority.MEDIUM).length >= 1) {
        filteredTasks.filter(task => task.priority == Priority.MEDIUM).forEach(task => {
          sortedTasks.push(task);
        });
        console.log('MEDIUM');
      } else if (filteredTasks.filter(task => task.priority == Priority.LOW).length >= 1) {
        filteredTasks.filter(task => task.priority == Priority.LOW).forEach(task => {
          sortedTasks.push(task);
        });
        console.log('LOW');
      }
    }

    return sortedTasks;
  }
  //#endregion

}
