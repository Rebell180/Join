import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../classes/task';
import { TaskStatusType } from '../enums/task-status-type';

@Injectable({
	providedIn: 'root'
})
export class TaskStateService {
	// Signal, das die Liste der Tasks hält
	private tasksSignal = signal<Task[]>([]);

	// Öffentliche readonly-Referenz (ersetzt tasks$)
	tasks = this.tasksSignal.asReadonly();

	// Setter
	setTasks(tasks: Task[]) {
		this.tasksSignal.set(tasks);
	}

	/** Hilfsfunktionen */

	getTodoCount(): number {
		return this.tasksSignal().filter(t => t.status === TaskStatusType.TODO).length;
	}

	getDoneCount(): number {
		return this.tasksSignal().filter(t => t.status === TaskStatusType.DONE).length;
	}

	getProgressCount(): number {
		return this.tasksSignal().filter(t => t.status === TaskStatusType.PROGRESS).length;
	}

	// Optional: Computed Signals, falls du reaktive Counts brauchst
	todoCount = computed(() =>
		this.tasksSignal().filter(t => t.status === TaskStatusType.TODO).length
	);

	doneCount = computed(() =>
		this.tasksSignal().filter(t => t.status === TaskStatusType.DONE).length
	);

	progressCount = computed(() =>
		this.tasksSignal().filter(t => t.status === TaskStatusType.PROGRESS).length
	);
}
