import { Component, computed, inject } from '@angular/core';
import { TaskStatusType } from '../../shared/enums/task-status-type';
import { TaskStateService } from '../../shared/services/task-state.service';

@Component({
  selector: 'section[summmary]',
  templateUrl: './summmary.component.html',
  styleUrls: ['./summmary.component.scss']
})
export class SummmaryComponent {
  private taskState = inject(TaskStateService);

  // Reaktive Counts direkt aus dem Signal berechnet
  todoCount = computed(() =>
    this.taskState.tasks().filter(t => t.status === TaskStatusType.TODO).length
  );

  doneCount = computed(() =>
    this.taskState.tasks().filter(t => t.status === TaskStatusType.DONE).length
  );

  progressCount = computed(() =>
    this.taskState.tasks().filter(t => t.status === TaskStatusType.PROGRESS).length
  );

  reviewCount = computed(() =>
    this.taskState.tasks().filter(t => t.status === TaskStatusType.REVIEW).length
  );
}