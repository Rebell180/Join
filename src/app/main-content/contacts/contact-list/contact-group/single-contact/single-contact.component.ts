import { Component, input } from '@angular/core';
import { Contact } from '../../../../../shared/classes/contact';

@Component({
  selector: 'app-single-contact',
  imports: [],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss'
})
export class SingleContactComponent {
  contact = input.required<Contact>();
}
