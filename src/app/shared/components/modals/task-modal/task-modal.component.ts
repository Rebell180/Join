import { Component, input, InputSignal } from '@angular/core';
import { Contact } from '../../../classes/contact';
import { Task } from '../../../classes/task';
import { Category } from '../../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ContactIconListComponent } from "../../contact-icon-list/contact-icon-list.component";
import { SubTask } from '../../../classes/subTask';
import { TaskStatusType } from '../../../enums/task-status-type';
import { Priority } from '../../../enums/priority.enum';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ContactIconListComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {

  contacts: Array<Contact> = [
    new Contact({ id: 'abcd', firstname: 'Marcus', lastname: 'Gühne', group: 'M', email: 'marcu@gmx.de', tel: '015245885', iconColor: 'blue' }),
    new Contact({ id: 'efgh', firstname: 'Sabine', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green' }),
];

  // task: InputSignal<Task> = input.required<Task>();

  task: Task = new Task({ id: 'fegt', title: 'headline show the Maininformation from Task', description: 'descriptions must be an informativ text', dueDate: '01.10.2025', priority: Priority.URGENT, category: Category.USERSTORY, assignedTo: [this.contacts[0]], subtasks: [
    new SubTask({ id: '', name: 'Analyse abschließen', finished: true }),
    new SubTask({ id: '', name: 'Design-Mockups erstellen', finished: false }),
  ],
  status: TaskStatusType.TODO
});


    Category = Category;
}
