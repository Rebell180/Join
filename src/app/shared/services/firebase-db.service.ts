import { inject, Injectable} from '@angular/core';
import { Contact } from '../classes/contact';
import { Task } from '../classes/task';
import { SubTask } from '../classes/subTask';
import { collection, CollectionReference, Firestore, Unsubscribe, where, Query, query, onSnapshot, addDoc, updateDoc, DocumentReference, doc, deleteDoc } from '@angular/fire/firestore';
import { DBObject } from '../interfaces/db-object';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  // #region properties

  firestore: Firestore = inject(Firestore);

  contacts: Array<Contact> = [];
  contactGroups: Array<string> = [];
  tasks: Array<Task> = [];
  subTasks: Array<SubTask> = [];

  unsubContacts: Unsubscribe;
  unsubTasks: Unsubscribe;
  unsubSubTasks: Unsubscribe;

  // #endregion properties

  constructor() {
      this.unsubContacts = this.getContactsSnapshot();
      this.unsubTasks = this.getTasksSnapshot();
      this.unsubSubTasks = this.getSubTasksSnapshot();

  }

  // #region methods

  // #region snapshots

  /**
   * Opens a two way data stream between code and firebase collection 'contacts'.
   * 
   * @returns an @type Unsubscribe.
   */
  getContactsSnapshot(): Unsubscribe {
    const q: Query = query(this.getCollectionRef('contacts'), where('id', '!=', 'null'));

    return onSnapshot(q, (list) => {
      this.contacts = [];
      list.forEach((docRef) => {
        this.contacts.push(this.mapResponseToContact({ ...docRef.data(), id: docRef.id}));
      });
      this.setContactGroups();
    });
  }

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
  private getCollectionRef(collectionName: string): CollectionReference {
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
  private getDocRef(collectionName: string, docId: string): DocumentReference  {
    const collectionRef: CollectionReference = this.getCollectionRef(collectionName);
    const docRef: DocumentReference = doc(collectionRef, `/${docId}`);
    return docRef;
  }

  /**
   * Maps a docRef-data-object to a contact object.
   * @param obj data object of a document as JSON-Format.
   * @returns a single contact instance.
   */
  private mapResponseToContact(obj: any): Contact {
    return new Contact(obj);
  }

  /**
   * Maps a docRef-data-object to a task object.
   * @param obj data object of a document as JSON-Format.
   * @returns a single task instance.
   */
  private mapResponseToTask(obj: any): Task {
    return new Task(obj);
  }

  /**
   * Maps a docRef-data-object to a subtask object.
   * @param obj data object of a document as JSON-Format.
   * @returns a single subtask instance.
   */
  private mapResponseToSubTask(obj: any): SubTask {
    return new SubTask(obj);
  }

  /**
   * Assign all different groups to Array.
   * This happens in contact snapshot.
   */
  private setContactGroups() {
    this.contactGroups = [];
    this.contacts.forEach((contact) => {
      if(!this.contactGroups.includes(contact.group)) {
        this.contactGroups.push(contact.group);
      }
    });
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
      //TODO Testen, ob es entfernt werden kann
      if(object.firstname === '' || object.lastname === '' || object.email === '' || object.tel === '') {
        return;
      }
    }

    try {
      const collectionRef = this.getCollectionRef(collectionName);
      const dbObjRef = await addDoc(collectionRef, object.toJSON());

      if(dbObjRef!== undefined && dbObjRef.id !== ''){
        await updateDoc(dbObjRef, {id: dbObjRef.id});
      }
    } catch(e) {
      console.log(e);
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
   * Deletes a document from firestore collection.
   * @param docId The id to remove.
   */
  async deleteInDB(collectionName: string, docId: string) {
    const docRef = this.getDocRef(collectionName, docId);
    await deleteDoc(docRef);
  }

  // #endregion CRUD

}
