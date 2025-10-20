import { Component, inject, input, InputSignal } from '@angular/core';
import { Task } from '../../classes/task';
import { ContactIconListComponent } from "../contact-icon-list/contact-icon-list.component";
import { Contact } from '../../classes/contact';
import { Priority } from '../../enums/priority.enum';
import { Category } from '../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { TaskStatusType } from '../../enums/task-status-type';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-task-column-item',
  imports: [ContactIconListComponent, CommonModule],
  templateUrl: './task-column-item.component.html',
  styleUrl: './task-column-item.component.scss'
})
export class TaskColumnItemComponent {

  task: InputSignal<Task> = input.required<Task>();
  protected modalService: ModalService = inject(ModalService);

  subtasks: { title: string, completed: boolean }[] = [
    { title: 'Analyse abschließen', completed: true },
    { title: 'Design-Mockups erstellen', completed: false },
  ];

  Category = Category;

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
