import { Component, input } from '@angular/core';
import { NavItemData } from '../aside.component';

@Component({
  selector: '[nav-item]',
  imports: [],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})
export class NavItemComponent {

  item = input.required<NavItemData>()
  
}
