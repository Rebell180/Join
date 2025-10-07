import { BehaviorSubject, Observable } from "rxjs";
import { Contact } from "./contact";


export class ContactGroup {

    name: string = '';
    contactsBS = new BehaviorSubject<Array<Contact>>([]);
    contacts: Observable<Array<Contact>> = this.contactsBS.asObservable();
}