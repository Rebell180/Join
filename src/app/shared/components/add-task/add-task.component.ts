import { Component, inject, OnDestroy,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseDBService } from '../../services/firebase-db.service';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../classes/task';
import { CommonModule } from '@angular/common';
import { PriorityButtonsComponent } from "../priority-buttons/priority-buttons.component";
import { Category } from '../../enums/category.enum';
import { query, Unsubscribe, where, Query, onSnapshot } from '@angular/fire/firestore';
import { Contact } from '../../classes/contact';
import { DatePickerComponent } from "../date-picker/date-picker.component";


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityButtonsComponent, DatePickerComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddtaskComponent implements OnDestroy {

  fireDB: FirebaseDBService = inject(FirebaseDBService);
  Priority = Priority;
  Category = Category;

  currentTask: Task = new Task();
  contacts: Array<Contact> = []

  unsubContacts: Unsubscribe;

  constructor() {
    this.unsubContacts = this.getContactsSnapshot();
  }

  ngOnDestroy() {
    this.unsubContacts();
  }

  /**
   * Opens a two way data stream between code and firebase collection 'contacts'.
   * 
   * @returns an @type Unsubscribe.
   */
  private getContactsSnapshot(): Unsubscribe {
    const q: Query = query(this.fireDB.getCollectionRef('contacts'), where('id', '!=', ''));
  
    return onSnapshot(q, (list) => {
      this.contacts = [];
      list.forEach((docRef) => {
        this.contacts.push(this.fireDB.mapResponseToContact({ ...docRef.data(), id: docRef.id}));
      });
    });
  }

  /**
   * Submit the entered data as new Task to DB
   *  
   * @param e event
   */
  async submitForm(e: SubmitEvent) {
    this.fireDB.addToDB('tasks', this.currentTask);
  }

  /**
   * Reset all inputs to default.
   */
  clear() {
    console.log(this.currentTask.priority);
  }

  toggleAddContactToAssignTo(contact: Contact) {
    if(this.currentTask.assignedTo.includes(contact.id)){
      // remove
    } else {
      this.currentTask.assignedTo.push(contact.id);
    }
  }

}
