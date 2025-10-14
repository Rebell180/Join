import { map, Observable } from "rxjs";
import { Contact } from "./contact";
import { ContactService } from "../services/contact.service";

/** Represents a group of contact. */
export class ContactGroup {

    _name: string = '';
    private members$!: Observable<Contact[]> ;

    constructor (private cs: ContactService, name:string) {
        this._name = name
        this.getMenmbers();
    }

    private getMenmbers() {
        this.members$ = this.cs.getAll().pipe(
            map( contacts => contacts.filter( contact => contact.group == this.name))
        );
    }

    get name():string {return this._name;}

    get members(): Observable<Contact[]> {return this.members$;}
}