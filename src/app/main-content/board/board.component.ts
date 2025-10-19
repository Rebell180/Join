import { Component, input, InputSignal, OnInit } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';
import { Task } from '../../shared/classes/task';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { Unsubscribe } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from "../../shared/components/modals/task-modal/task-modal.component";

@Component({
  selector: 'section[board]',
  standalone: true,
  imports: [
    SearchTaskComponent,
    CommonModule,
    TaskModalComponent
],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{

  shownTasks!: Task[];
  tasksSnapshot!: Unsubscribe

  constructor(private fdb:FirebaseDBService) {}

  ngOnInit(): void {
    this.shownTasks = this.fdb.tasks;
  }

  /**
   * Filters all Tasks by user input.
   * @param userSearch - Input from User-Searchbar.
   */
  filterTasks(userSearch: string) {
    this.shownTasks = userSearch.length == 0 ? this.fdb.tasks : this.fdb.tasks.filter(task => task.title.includes(userSearch));
  }

  /** Gets all Tasks, which has been searched.
   * If user is not looking for tasks, all tasks are schown.
   */
  getTasks() {
    return this.shownTasks;
  }
}
