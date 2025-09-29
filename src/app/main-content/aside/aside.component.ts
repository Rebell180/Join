import { Component } from '@angular/core';
import { NavItemComponent } from '../../shared/nav-item/nav-item.component';
import { NavItemData } from '../../shared/interfaces/navitemdata';

@Component({
  selector: 'app-aside',
  imports: [NavItemComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  item: Array<NavItemData> = [ 
      {
      sectionId: 'Summary',
      title: 'Summary',
      imagePath: 'assets/Icons/Summary.png'
      },
      {
      sectionId: 'addTask',
      title: 'Add task',
      imagePath: 'assets/Icons/addTask.png'
      },
      {
      sectionId: 'Boards', 
      title: 'Boards',
      imagePath: 'assets/Icons/Board.png'
      },
      {
      sectionId: 'Contacts', 
      title: 'Contacts',
      imagePath: 'assets/Icons/Contacts.png'
      }
    ]
}
