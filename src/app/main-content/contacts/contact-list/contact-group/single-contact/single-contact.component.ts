import { Component, input } from '@angular/core';
import { Contact } from '../../../../../shared/classes/contact';
import { ContactIconComponent } from '../../../contact-icon/contact-icon.component';

@Component({
  selector: 'app-single-contact',
  imports: [
    ContactIconComponent
  ],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss'
})
export class SingleContactComponent {
  contact = input.required<Contact>();  

  /**
   * Gets the first name of contact, if contact has more then one name.
   * @param name - Name to convert
   * @returns - First name of contact.
   */
  oneName(name:string):string {
    const words = name.match(/[A-ZÄÖÜ][a-zäöüß]*/);
    return words ? words[0] : '';
  }

  /**
   * Gets the full name of contact.
   * @returns - Full name of contact.
   */
  fullName():string {
    return `${this.contact().firstName} ${this.contact().lastName}`
  }

  limit(word: string, maxLength: number): string {
    return word.length <= maxLength ? word : word.slice(0, maxLength) + '...';
  }
}
