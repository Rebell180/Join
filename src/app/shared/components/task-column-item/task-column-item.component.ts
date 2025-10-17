import { Component } from '@angular/core';
import { Task } from '../../classes/task';
import { ContactIconListComponent } from "../contact-icon-list/contact-icon-list.component";
import { Contact } from '../../classes/contact';
import { Priority } from '../../enums/priority.enum';
import { Category } from '../../enums/category.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-column-item',
  imports: [ContactIconListComponent, CommonModule],
  templateUrl: './task-column-item.component.html',
  styleUrl: './task-column-item.component.scss'
})
export class TaskColumnItemComponent {

  contacts: Array<Contact> = [
    new Contact({ id: 'abcd', firstname: 'Marcus', lastname: 'Gühne', group: 'M', email: 'marcu@gmx.de', tel: '015245885', iconColor: 'blue', }),
    new Contact({ id: 'efgh', firstname: 'Sabine', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green', }),
    new Contact({ id: 'ijkl', firstname: 'Thomas', lastname: 'Müller', group: 'T', email: 'thomas.mueller@t-online.de', tel: '0301234567', iconColor: 'pink', }),
    new Contact({ id: 'efgh', firstname: 'Sabine', lastname: 'Schmidt', group: 'S', email: 'sabine.schmidt@web.de', tel: '0171987654', iconColor: 'green', }),
    new Contact({ id: 'ijkl', firstname: 'Thomas', lastname: 'Müller', group: 'T', email: 'thomas.mueller@t-online.de', tel: '0301234567', iconColor: 'pink', })
  ];

  task: Task = new Task({ id: 'fegt', title: 'headline show the Maininformation from Task', description: 'descriptions must be an informativ text', dueDate: '01.40.2025', priority: Priority.URGENT, category: Category.USERSTORY, assignedTo: ['a', 'b'], subtasks: false }) 

  subtasks: { title: string, completed: boolean }[] = [
    { title: 'Analyse abschließen', completed: true },
    { title: 'Design-Mockups erstellen', completed: false },
  ];

  /**
   * Berechnet die Anzahl der abgeschlossenen Unteraufgaben.
   */
  get completedSubtaskCount(): number {
    return this.subtasks.filter(sub => sub.completed).length;
  }

  /**
   * Gibt die Gesamtzahl der Unteraufgaben zurück.
   */
  get totalSubtaskCount(): number {
    return this.subtasks.length;
  }

  /**
   * Berechnet den Fortschritt in Prozent (z.B. 33.33).
   */
  get subtaskProgressPercentage(): number {
    if (this.totalSubtaskCount === 0) {
      return 0;
    }
    return (this.completedSubtaskCount / this.totalSubtaskCount) * 100;
  }

  /**
   * Steuert die Sichtbarkeit gemäß der Anforderung: Nur sichtbar ab 2 Subtasks.
   */
  get isSubtaskProgressVisible(): boolean {
    return this.totalSubtaskCount >= 2;
  }
}
