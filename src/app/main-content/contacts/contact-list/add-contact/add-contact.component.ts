import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-contact',
  imports: [],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {

  private firestore: Firestore = inject(Firestore);

  addContactModalVisiblity: "hidden" | "visible" = "hidden";

  openAddContactModal() {
    console.log('Add contact');
    if(this.addContactModalVisiblity === "hidden"){
      this.addContactModalVisiblity = "visible";

    } else {
      this.addContactModalVisiblity = "hidden";
    }
  }
}
