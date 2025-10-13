import { inject, Injectable } from '@angular/core';
import { Contact } from '../classes/contact';
import { ContactGroup } from '../classes/contactGroup';
import { collection, CollectionReference, doc, DocumentReference, Firestore } from '@angular/fire/firestore';

type AllowedTypes = Contact | ContactGroup;

@Injectable({
  providedIn: 'root'
})
export class FireService<T extends AllowedTypes> {

  private fs:Firestore = inject(Firestore);

  constructor() { }

  // #region methods
  // #region references
  /**
   * Gets a collection from a path.
   * @param path - Name of collection in database.
   * @returns - Collection of path.
   */
  private getCollectionRef(path:string): CollectionReference {
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
  // #endregion
}
