import { inject, Injectable } from '@angular/core';
import { Contact } from '../classes/contact';
import { addDoc, collection, CollectionReference, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { DatabaseObject } from '../interfaces/database-object';
import { Observable } from 'rxjs';

type AllowedTypes = Contact;

@Injectable({
  providedIn: 'root'
})
export abstract class FireService<T extends AllowedTypes & DatabaseObject> {

  protected fs:Firestore = inject(Firestore);

  constructor() { }

  // #region methods
  // #region references
  /**
   * Gets a collection from a path.
   * @param path - Name of collection in database.
   * @returns - Collection of path.
   */
  protected getCollectionRef(path:string): CollectionReference {
    return collection(this.fs, path);
  }

  /**
   * Get a concret document from database.
   * @param path - Name of collection in database.
   * @param docId - Id of document in database.
   * @returns Document reference of path and docid.
   */
  private getSingleRef(path:string, docId:string): DocumentReference {
    return doc(this.getCollectionRef(path), `/${docId}`);
  }
  // #endregion
  
  // #region CRUD
  /**
   * Instert a DatabaseObject into database.
   * @param data - Object to add.
   */
  async add(data: T) {
    const path:string = data instanceof Contact ? 'contacts' : '';
    if (path.length > 0) {
      const newDocRef = await addDoc(this.getCollectionRef(path), data.toJSObject());
      if (newDocRef.id.length > 0) {
        await updateDoc(newDocRef, {id: newDocRef.id});
      }
    }
  }

  /**
   * Gets all documents of a Collection.
   * It is nessery to override this method in a subclass
   * @retuns List of entries as oberbalee.
   */
  abstract getAll(): Observable<T[]>


  async update(data: T) {
    const path: string = data instanceof Contact ? 'contacts' : '';
    if (path.length > 0) {
      await updateDoc(this.getSingleRef(path, data.id), data.toJSObject());
    }
  }
  // #endregion
}
