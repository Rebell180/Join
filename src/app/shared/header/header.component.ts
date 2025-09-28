import { Component } from '@angular/core';

@Component({
  /* Wenn der Selector so in eckige Klammern gesceiben wird,
   * bedeutet das, die Komponente in ein normals Header-Tag eingebunden wird
   * Der Name der Komponente app-header muss sich dabei vom Tag <header> unterscheien. */
  selector: 'header[app-header]',
  // Wird so eingebunden: <header app-header></header>
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
}
