import { Component, input, InputFunction } from '@angular/core';

@Component({
  selector: 'app-contact-group',
  imports: [],
  templateUrl: './contact-group.component.html',
  styleUrl: './contact-group.component.scss'
})
export class ContactGroupComponent {
  public letter = input.required<string>();
}
