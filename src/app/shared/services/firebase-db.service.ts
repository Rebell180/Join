import { inject, Injectable} from '@angular/core';
import { Contact } from '../classes/contact';
import { Task } from '../classes/task';
import { SubTask } from '../classes/subTask';
import { collection, CollectionReference, Firestore, Unsubscribe, where, Query, query, onSnapshot, addDoc, updateDoc, DocumentReference, doc, deleteDoc } from '@angular/fire/firestore';
import { DBObject } from '../interfaces/db-object';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastMsgService } from './toast-msg.service';
import { SubtaskEditState } from '../enums/subtask-edit-state';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  // #region properties

  private firestore: Firestore = inject(Firestore);

  private currentContactBS: BehaviorSubject<Contact> = new BehaviorSubject<Contact>(new Contact());
  currentContact$: Observable<Contact> = this.currentContactBS.asObservable();

  private tms: ToastMsgService = inject(ToastMsgService);
  
  tasks: Array<Task> = [];
  subTasks: Array<SubTask> = [];

  unsubTasks: Unsubscribe;
  unsubSubTasks: Unsubscribe;

  // #endregion properties

  constructor() {
      this.unsubTasks = this.getTasksSnapshot();
      this.unsubSubTasks = this.getSubTasksSnapshot();
  }

  // #region methods

  // #region snapshots

  /**
   * Opens a two way data stream between code and firebase collection 'tasks'.
   * 
   * @returns an @type Unsubscribe.
   */
  getTasksSnapshot(): Unsubscribe {
    const q: Query = query(this.getCollectionRef('tasks'), where('id', '!=', 'null'));

    return onSnapshot(q, (list) => {
      this.tasks = [];
      list.forEach((docRef) => {
        this.tasks.push(this.mapResponseToTask({ ...docRef.data(), id: docRef.id}));
      });
    });
  }

  /**
   * Opens a two way data stream between code and firebase collection 'subtasks'.
   * 
   * @returns an @type Unsubscribe.
   */
  getSubTasksSnapshot(): Unsubscribe {
    const q: Query = query(this.getCollectionRef('subtasks'), where('id', '!=', 'null'));

    return onSnapshot(q, (list) => {
      this.subTasks = [];
      list.forEach((docRef) => {
        this.subTasks.push(this.mapResponseToSubTask({ ...docRef.data(), id: docRef.id}));
      });
    });
  }

  // #endregion snapshots

  // #region helpers

  /**
   * Returns the reference of a collection with @param collectionName.
   * 
   * @returns - a single reference of a collection.
   */
  getCollectionRef(collectionName: string): CollectionReference {
    let collectionRef!: CollectionReference;
    try {
      collectionRef = collection(this.firestore, collectionName);
    } catch(e) {
      console.log(e);
    }
    return collectionRef;
  }

  /**
   * Returns the reference of a document from firebase 
   * with @param collectionName and paired to that with
   * @param docId.
   * 
   * @returns - a single reference of a document by id.
   */
  getDocRef(collectionName: string, docId: string): DocumentReference  {
    const collectionRef: CollectionReference = this.getCollectionRef(collectionName);
    const docRef: DocumentReference = doc(collectionRef, `/${docId}`);
    return docRef;
  }

  /**
   * Maps a docRef-data-object to a contact object.
   * @param obj data object of a document as JSON-Format.
   * @returns a single contact instance.
   */
  mapResponseToContact(obj: any): Contact {
    return new Contact(obj);
  }

  /**
   * Maps a docRef-data-object to a task object.
   * @param obj data object of a document as JSON-Format.
   * @returns a single task instance.
   */
  mapResponseToTask(obj: any): Task {
    return new Task(obj);
  }

  /**
   * Maps a docRef-data-object to a subtask object.
   * @param obj data object of a document as JSON-Format.
   * @returns a single subtask instance.
   */
  mapResponseToSubTask(obj: any): SubTask {
    return new SubTask(obj);
  }

  // #endregion helpers

  // #region CRUD

  /**
   * Adds a new document to the Firestore collection via
   * @param collectionName address of collection in database and   
   * @param object The object to add.
   * 
   * Updates object after id was created through add to save id
   * in document self.  
   */
  async addToDB(collectionName: string, object: DBObject): Promise<void> {
    if(object instanceof Contact) {
      object.group = object.firstname[0].toUpperCase(); 
      if(object.firstname === '' || object.lastname === '' || object.email === '' || object.tel === '') {
        return;
      }
    }
    
    try {
      const collectionRef = this.getCollectionRef(collectionName);
      const dbObjRef = await addDoc(collectionRef, object.toJSON());
      if(dbObjRef !== undefined && dbObjRef.id !== ''){
        await updateDoc(dbObjRef, {id: dbObjRef.id});
      }
    } catch(e) {
      // console.log(e);
    }
  }

  /**
   * Adds a task to database and update after add to save id
   * and adds subtasks to database.
   * 
   * @param collectionName name of collection in database.
   * @param task task to add to database.
   */
  async taskAddToDB(collectionName: string, task: Task) {
    const collectionRef = this.getCollectionRef(collectionName);
    const dbObjRef = await addDoc(collectionRef, task.toJSON());
    task.id = dbObjRef.id;
    if(task.hasSubtasks) {
      await this.taskUpdateInDB(collectionName, task);
    }
  }

  /**
   * Updates an existing document in firestore collection.
   * @param collectionName address of collection in database and
   * @param object The object with data to update.
   */
  async updateInDB(collectionName: string, object: DBObject) {
    if( object instanceof Contact ) {
      object.group = object.firstname[0];
    }
    const docRef  = this.getDocRef(collectionName, object.id);
    await updateDoc(docRef, object.toJSON());
  }

  /**
   * Updates a task with his subtasks in database.
   * 
   * @param collectionName name of collection in database.
   * @param doc task to update in database.
   */
  async taskUpdateInDB(collectionName: string, doc: Task): Promise<void> {
    if(doc.hasSubtasks) {
      await this.handleSubtasksInDB(doc.subtasks, doc.id);
    }
    await this.updateInDB(collectionName, doc);
  }

  /**
   * Deletes a document from firestore collection.
   * @param docId The id to remove.
   */
  async deleteInDB(collectionName: string, doc: DBObject) {
    const docRef = this.getDocRef(collectionName, doc.id);
    await deleteDoc(docRef);
  }

  /**
   * Deletes a single task from database. 
   * Deletes also existing subtasks.
   * 
   * @param collectionName name of collection in database.
   * @param doc task to delete in database.
   */

  async deleteTaskInDB(collectionName: string, doc: Task) {
    if(doc.hasSubtasks) {
      // hier verwende ich jetzt Promise.all und map, um auf alle asynchronen Löschvorgänge zu warten.
      const subtaskDeletions = doc.subtasks.map(subTask => 
          this.deleteInDB('subtasks', subTask)
      );
      await Promise.all(subtaskDeletions); // hier warte ich bis alle Subtasks gelöscht sind
    }
    
    await this.deleteInDB(collectionName, doc);
    this.tms.add('Deleting Task successfully', 3000, 'success');
  }
  // #endregion CRUD

  // #region contact helper

  /**
   * Sets the current selected Contact.
   * 
   * @param contact the contact which is selected.
   */
  setCurrentContact(contact: Contact) {
    this.currentContactBS.next(contact);
  }

  async handleSubtasksInDB(subtasks: Array<SubTask>, taskId: string) {
    subtasks.forEach(async (subTask) => {
      const colName: string = 'subtasks';
      switch(subTask.editState) {
        case SubtaskEditState.NEW:
          subTask.taskId = taskId;
          await this.addToDB(colName, subTask);
          break;
        case SubtaskEditState.CHANGED:
          this.updateInDB(colName, subTask);
          break;
        case SubtaskEditState.DELETED:
          this.deleteInDB(colName, subTask);
          break;
        default:
          break;
      }
    });
  }

  // #enregion contact helper

}
