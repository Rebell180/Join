import { Component,inject,input, InputSignal, output } from '@angular/core';
import { Task } from '../../../classes/task';
import { Category } from '../../../enums/category.enum';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from "../../contact-icon/contact-icon.component";
import { FormsModule } from '@angular/forms';
import { collection, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { SubTask } from '../../../classes/subTask';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ContactIconComponent, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
/**
 * Component representing a modal for managing a task.
 * Provides functionalities to update subtasks, delete tasks, and handle modal visibility.
 */
export class TaskModalComponent {

  /** Firestore instance injected for database operations */
  firestore: Firestore = inject(Firestore);

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
   * Updates the status of a given subtask in Firestore.
   * @param subtask - The subtask object to update
   * @returns A promise that resolves when the Firestore update is complete
   */
  async updateSubTaskStatus(subtask: SubTask) {
    await updateDoc(doc(collection(this.firestore, 'subtask'), subtask.id), subtask.toJSON());
    console.log(subtask);
  }

  /**
   * Deletes a task from Firestore by its ID.
   * @param taskId - The ID of the task to delete
   * @returns A promise that resolves when the task is successfully deleted
   */
  async deleteTask(taskId: string) {
  await deleteDoc(doc(collection(this.firestore, 'tasks'), taskId));
  console.log(`Task mit ID ${taskId} wurde gelöscht.`);
}
}
