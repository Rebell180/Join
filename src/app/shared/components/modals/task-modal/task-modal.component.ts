import { Component } from '@angular/core';
import { Contact } from '../../../classes/contact';
import { Task } from '../../../classes/task';
import { Priority } from './../../../enums/priority.enum';
import { Category } from '../../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ContactIconListComponent } from "../../contact-icon-list/contact-icon-list.component";

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ContactIconListComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {

  dissolve?: () => void;

  isOpen = false;

  contacts: Array<Contact> = [
      new Contact({ id: 'abcd', firstname: 'Marcus', lastname: 'Gühne', group: 'M', email: 'marcu@gmx.de', tel: '015245885', iconColor: 'blue', }),
      new Contact({ id: 'efgh', firstname: 'Sabine', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green', }),
    ];
  
    task: Task = new Task({ id: 'fegt', title: 'headline show the Maininformation from Task', description: 'descriptions must be an informativ text', dueDate: '01.10.2025', priority: Priority.URGENT, category: Category.USERSTORY, assignedTo: ['Marcus Gühne', 'Marcel Buchmann'], subtasks: false }) 
  
    subtasks: { title: string, completed: boolean }[] = [
      { title: 'Analyse abschließen', completed: true },
      { title: 'Design-Mockups erstellen', completed: false },
    ];

    Category = Category;

    closeModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 400);
  }
}
