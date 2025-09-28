import { Component } from '@angular/core';
import { NavItemData } from './../interfaces/navitemdata';
import { NavItemComponent } from "../nav-item/nav-item.component";

@Component({
  /* Wenn der Selector so in eckige Klammern gesceiben wird,
   * bedeutet das, die Komponente in ein normales Header-Tag eingebunden wird
   * Der Name der Komponente app-header muss sich dabei vom Tag <header> unterscheien. */
  selector: 'header[app-header]',
  imports: [NavItemComponent], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
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
