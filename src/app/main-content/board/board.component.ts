import { Component } from '@angular/core';
import { SearchTaskComponent } from './search-task/search-task.component';

@Component({
  selector: 'section[board]',
  imports: [
    SearchTaskComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

}
