import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { AsideComponent } from "./../../app/main-content/aside/aside.component";
import { ContactsComponent } from './contacts/contacts.component';
import { SectionType } from '../shared/enums/section-type';
import { BoardComponent } from './board/board.component';
import { AddTaskContainerComponent } from "./add-task-container/add-task-container.component";

@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
    AsideComponent,
    ContactsComponent,
    BoardComponent,
    AddTaskContainerComponent,
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  protected readonly SectionType = SectionType
  protected currentSection: SectionType = SectionType.BOARD;

  changeSection(section: SectionType) {this.currentSection = section}

}