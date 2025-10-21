import { Component, inject, input, InputSignal } from '@angular/core';
import { Task } from '../../classes/task';
import { ContactIconListComponent } from "../contact-icon-list/contact-icon-list.component";
import { Category } from '../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { FirebaseDBService } from '../../services/firebase-db.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-task-column-item',
  imports: [ContactIconListComponent, CommonModule],
  templateUrl: './task-column-item.component.html',
  styleUrl: './task-column-item.component.scss'
})
export class TaskColumnItemComponent {

  // protected fireDB: FirebaseDBService = inject(FirebaseDBService);
  protected modalService: ModalService = inject(ModalService);
  firestore: Firestore = inject(Firestore);

  task: InputSignal<Task> = input.required<Task>();


  Category = Category;

  /**
   * Berechnet die Anzahl der abgeschlossenen Unteraufgaben.
   */
  get completedSubtaskCount(): number {
    return this.task().subtasks.filter(sub => sub.finished).length;
  }

  /**
   * Gibt die Gesamtzahl der Unteraufgaben zurück.
   */
  get totalSubtaskCount(): number {
    return this.task().subtasks.length;
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
