import { BehaviorSubject, Observable } from "rxjs";
import { Contact } from "./contact";

/** Represents a group of contact. */
export class ContactGroup {

    name: string = '';
    contactsBS = new BehaviorSubject<Array<Contact>>([]);
    contacts: Observable<Array<Contact>> = this.contactsBS.asObservable();
}