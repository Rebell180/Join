import { Component, input, InputFunction } from '@angular/core';
import { Contact } from '../../../../shared/classes/contact';
import { DummyContactService } from '../dummy-contact.service';
import { CommonModule } from '@angular/common';
import { SingleContactComponent } from './single-contact/single-contact.component';

@Component({
  selector: 'app-contact-group',
  imports: [
    CommonModule,
    SingleContactComponent
  ],
  templateUrl: './contact-group.component.html',
  styleUrl: './contact-group.component.scss'
})
export class ContactGroupComponent {
  public letter = input.required<string>();

  constructor(private dcs:DummyContactService) {}

  getContacts():Contact[] {
    return this.dcs.getContactsByGroup(this.letter());
  }
}
