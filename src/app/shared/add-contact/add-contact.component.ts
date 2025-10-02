import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-contact',
  imports: [],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent implements OnInit{

  kindOf: InputSignal<string> = input.required<string>();
  closeOutput: OutputEmitterRef<void> = output<void>();
  isVisible: boolean = false;

  private firestore: Firestore = inject(Firestore);

  // addContactModalVisiblity: "hidden" | "visible" = "hidden";

  constructor() {

  }


  ngOnInit(): void {
    if(this.kindOf().valueOf() == 'add') {
      console.log();
      this.isVisible = true;
    }
  }

  addContact() {
    // inputfields values
    // set contact
    // add to firestore
  }

  closeModal () {
    this.closeOutput.emit();
  }
}
