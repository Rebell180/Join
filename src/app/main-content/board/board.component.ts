import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';
import { Task } from '../../shared/classes/task';
import { collection, CollectionReference, doc, DocumentReference, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Priority } from '../../shared/enums/priority.enum';
import { Category } from '../../shared/enums/category.enum';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { TaskListColumnComponent } from './task-list-column/task-list-column.component';
import { Contact } from '../../shared/classes/contact';
import { SubTask } from '../../shared/classes/subTask';

interface SimpleTaskObject {
  id: string,
  title: string,
  category: Category,
  description: string,
  priority: Priority,
  dueDate: string,
  assignedTo: string[],
  subtasks: string[],
  status: TaskStatusType
}

interface ContactObject {
  id: string,
  firstname: string,
  lastname: string,
  group: string,
  email: string,
  tel: string,
  iconColor: string
}

interface SubTaskObject {
  id: string,
  name: string,
  finished: boolean
}

interface TaskObject {
  id: string,
  title: string,
  category: Category,
  description: string,
  priority: Priority,
  dueDate: string,
  assignedTo: Contact[],
  subtasks: SubTask[],
  status: TaskStatusType
}

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
  private contactSubscribers: Unsubscribe[] = [];
  private subtaskSubscribers: Unsubscribe[] = [];
  // #endregion

  ngOnInit(): void {
    this.unsubTasks = this.subscribeTasks( tasks => {
      this.tasks = tasks;
      this.shownTasks = tasks;
    });
  }

  ngOnDestroy(): void {
    this.unsubTasks();
    this.unsubscribeAll(this.contactSubscribers);
    this.unsubscribeAll(this.subtaskSubscribers);
  }

  // #region methods
  // #region database
  /**
   * Subscribes task-collection.
   *  @returns - Unsubscribe for tasks-collection
   */
  private subscribeTasks(callback: (tasks: Task[]) => void): Unsubscribe {
    return onSnapshot(this.getTaskRef(), taskSnapshot => {
      const simpleTaskObjects: SimpleTaskObject[] = taskSnapshot.docs.map(doc => doc.data()) as SimpleTaskObject[];
      if (simpleTaskObjects.length == 0) {
        callback([]);
        return;
      }
      const tasks: Task[] = [];
      simpleTaskObjects.forEach(sto => {
        const contacts: Contact[] = this.getTaskContacts(sto);
        const subtasks: SubTask[] = this.getTaskSubTasks(sto);
        tasks.push(this.mapTask(sto, contacts, subtasks));
      });
      callback(tasks);
    });
  }

  /**
   * Gets asigned Members of task.
   * @param sto - SimpleTaskObject
   * @returns - Assigned Mebers of one task.
   */
  private getTaskContacts(sto: SimpleTaskObject): Contact[] {
    const contacts: Contact[] = [];
    for (let i = 0; i < sto.assignedTo.length; i++) {
      this.contactSubscribers.push(this.subscribeContact(sto.assignedTo[i], contact => {
        if (contact) contacts.push(contact);
      }));
    }
    return contacts
  }

  /**
   * Gets all Subtesks form a task.
   * @param sto - SimpleTaskObject.
   * @returns - Subtasks from task.
   */
  private getTaskSubTasks(sto: SimpleTaskObject): SubTask[] {
    const subTaskSubscribers: Unsubscribe[] = [];
    const subtasks: SubTask[] = [];
    for (let i = 0; i < sto.subtasks.length; i++) {
      this.subtaskSubscribers.push(this.subscribeSubTask(sto.subtasks[i], subtask => {
        if (subtask) subtasks.push(subtask);
      }))
    }
    this.unsubscribeAll(subTaskSubscribers);
    return subtasks;
  }

  /**
   * Subscribes contacts from a task.
   * @param contactId - DocumentID.
   * @param callback - Function, what to do with contacts
   * @returns - Unsubscribe contacts.
   */
  private subscribeContact(contactId: string, callback: (contact: Contact | null) => void): Unsubscribe {
    const contactRef: DocumentReference = doc(this.fs, `contacts/${contactId}`);
    return onSnapshot(contactRef, (contactSnapshot) => {
      const contactObject: ContactObject | undefined = contactSnapshot.exists() ? contactSnapshot.data() as ContactObject : undefined;
      const contact: Contact | null = contactObject ? this.mapContact(contactObject) : null;
      callback(contact);
    });
  }

  /**
   * Subscrebes subtasks of task.
   * @param subtaskId - DocumentID.
   * @param callback - What to do with subtask.
   * @returns Unsubsribe subtasks.
   */
  private subscribeSubTask(subtaskId: string, callback: (subtask: SubTask | null) => void): Unsubscribe {
    const subtaskRef: DocumentReference = doc(this.fs, `subtask/${subtaskId}`);
    return onSnapshot(subtaskRef, subtaskSnap => {
      const subTaskObj: SubTaskObject | undefined = subtaskSnap.exists() ? subtaskSnap.data() as SubTaskObject : undefined;
      const subTask: SubTask | null = subTaskObj ? this.mapSubTask(subTaskObj) : null;
      callback(subTask);
    })
  }

  /**
   * Unsubcribes some Unsubcribes.
   * @param unsubsribes - Array of usubscribes to unsubribe.
   */
  private unsubscribeAll(unsubsribes: Unsubscribe[]): void {
    unsubsribes.forEach(unsub => unsub());
  }

  /**
   * Gets the task collection reference.
   * @returns - Collection-Reference for tasks.
   */
  private getTaskRef(): CollectionReference {
    return collection(this.fs, 'tasks');
  }

  /**
   * Creates a Task from SimpleTaskObject.
   * @param obj - SimpleTaskObject to map.
   * @param contacts - Contact-list of task.
   * @param subtasks - List of subtasks from task
   * @returns - Instance of Task
   */
  private mapTask(obj: SimpleTaskObject, contacts: Contact[], subtasks: SubTask[]): Task {
    const temp: TaskObject = {...obj, assignedTo: contacts, subtasks: subtasks}
    return new Task(temp);
  }

  /**
   * Maps a ContactObject to a Contact.
   * @param obj - ContactObject to map
   * @returns - Instance of Contact.
   */
  private mapContact(obj: ContactObject): Contact { return new Contact(obj); }

  /**
   * Maps a SubTaskObject to a SubTask.
   * @param obj - SubtaskObject to map.
   * @returns - Instance of subtask.
   */
  private mapSubTask(obj: SubTaskObject): SubTask { return new SubTask(obj) }
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