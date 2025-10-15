import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { AsideComponent } from "./../../app/main-content/aside/aside.component";
import { ContactsComponent } from './contacts/contacts.component';
import { SectionType } from '../shared/enums/section-type';

@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
    AsideComponent,
    ContactsComponent
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  protected readonly SectionType = SectionType
  protected currentSection: SectionType = SectionType.BOARD;
}