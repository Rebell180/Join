import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  /* Wenn der Selector so in eckige Klammern gesceiben wird,
   * bedeutet das, die Komponente in ein normales Header-Tag eingebunden wird
   * Der Name der Komponente app-header muss sich dabei vom Tag <header> unterscheien. */
  selector: 'header[app-header]',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
}
