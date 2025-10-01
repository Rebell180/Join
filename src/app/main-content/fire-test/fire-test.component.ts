import { Component } from '@angular/core';
import { FireContactService } from '../../shared/services/fire-contact.service';
import { Contact } from '../../shared/classes/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fire-test',
  imports: [
    CommonModule
  ],
  templateUrl: './fire-test.component.html',
  styleUrl: './fire-test.component.scss'
})
export class FireTestComponent {
  constructor(public fcs:FireContactService) {
    fcs.subGroupContactList('M');
  }

  getMembers() {
    return this.fcs.getMembers();
  }
}
