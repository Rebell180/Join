import { Component, input, InputSignal } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { AsideComponent } from "./../../app/main-content/aside/aside.component";
import { ContactsComponent } from './contacts/contacts.component';
import { SectionType } from '../shared/enums/section-type';
import { BoardComponent } from './board/board.component';
@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
    AsideComponent,
    ContactsComponent,
    BoardComponent
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
}