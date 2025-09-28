import { Component, input } from '@angular/core';
import { NavItemData } from './../interfaces/navitemdata';

@Component({
  selector: 'li[nav-item]',
  imports: [],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})
export class NavItemComponent {

  item = input.required<NavItemData>()
}
