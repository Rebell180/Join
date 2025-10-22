import { Component, inject, input, InputSignal, output } from '@angular/core';
import { Task } from '../../../classes/task';
import { Category } from '../../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from "../../contact-icon/contact-icon.component";
import { FormsModule } from '@angular/forms';
import { SubTask } from '../../../classes/subTask';
import { FirebaseDBService } from '../../../services/firebase-db.service';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, FormsModule, ContactIconComponent],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
/**
 * Component representing a modal for managing a task.
 * Provides functionalities to update subtasks, delete tasks, and handle modal visibility.
 */
export class TaskModalComponent {

  /** FirebaseDBService instance injected for database operations */
  fireDB: FirebaseDBService = inject(FirebaseDBService);

  /** Input signal representing the current task (required) */
  task: InputSignal<Task> = input.required<Task>();

  /** Flag indicating if the modal is currently open */
  isOpen = false;

  /** Optional callback to be executed when the modal is closed/dissolved */
  dissolve?: () => void;

  /** Output event triggered when a task is deleted, emits the task ID */
  taskDeleted = output<string>();

  /**
   * Closes the task modal.
   * Sets `isOpen` to false and calls `dissolve` callback after 200ms, if provided.
   */
  closeTaskModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 200);
  }

  /** Enum or constant representing categories of tasks */
  Category = Category;

  /**
   * Updates the completion status of a subtask in the database.
   *
   * This function is typically triggered by a checkbox change event.
   * It reads the `checked` state from the event, updates the `finished` property
   * of the provided `SubTask` object accordingly, and saves the change asynchronously
   * to the Firestore database.
   *
   * @async
   * @param {SubTask} subtask - The subtask object whose completion status should be updated.
   * @param {Event} event - The event triggered by the user interaction (e.g., checkbox toggle).
   * @returns {Promise<void>} A promise that resolves once the update is complete.
   */
  async updateSubTaskStatus(subtask: SubTask, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    subtask.finished = checked;

    await this.fireDB.updateInDB('subtask', subtask);
  }

}
