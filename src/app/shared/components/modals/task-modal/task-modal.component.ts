import { Component, inject, input, InputSignal, output } from '@angular/core';
import { Contact } from '../../../classes/contact';
import { Task } from '../../../classes/task';
import { Category } from '../../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from "../../contact-icon/contact-icon.component";
import { FirebaseDBService } from '../../../services/firebase-db.service';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ContactIconComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {

  protected fireDB: FirebaseDBService = inject(FirebaseDBService);

  contacts: Array<Contact> = [
    new Contact({ id: 'abcd', firstname: 'Marcus', lastname: 'Gühne', group: 'M', email: 'marcu@gmx.de', tel: '015245885', iconColor: 'blue' }),
    new Contact({ id: 'efgh', firstname: 'Sabine', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green' }),
  ];

  isOpen = false;
  dissolve?: () => void;

  task: InputSignal<Task> = input.required<Task>();

  taskDeleted = output<string>();

  closeTaskModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 200);
  }

  Category = Category;

}
