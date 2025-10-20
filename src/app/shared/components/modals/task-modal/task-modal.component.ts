import { Component, input, InputSignal } from '@angular/core';
import { Contact } from '../../../classes/contact';
import { Task } from '../../../classes/task';
import { Category } from '../../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from "../../contact-icon/contact-icon.component";

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ContactIconComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {

  contacts: Array<Contact> = [
    new Contact({ id: 'abcd', firstname: 'Marcus', lastname: 'Gühne', group: 'M', email: 'marcu@gmx.de', tel: '015245885', iconColor: 'blue' }),
    new Contact({ id: 'efgh', firstname: 'Sabine', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green' }),
    new Contact({ id: 'abcd', firstname: 'Marcel', lastname: 'Buchmann', group: 'M', email: 'marcu@gmx.de', tel: '015245885', iconColor: 'blue' }),
    new Contact({ id: 'efgh', firstname: 'Sabse', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green' }),
];

  isOpen = false;
  dissolve?: () => void;

  task: InputSignal<Task> = input.required<Task>();

  closeTaskModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 200);
  }

  Category = Category;
}
