import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { AsideComponent } from "./aside/aside.component";
import { ContactsComponent } from './contacts/contacts.component';
import { SectionType } from '../shared/enums/section-type';
import { BoardComponent } from './board/board.component';
import { AddTaskContainerComponent } from "./add-task-container/add-task-container.component";
import { PrivacyPolicyComponent } from '../main-content/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from '../main-content/legal-notice/legal-notice.component';
import { SummmaryComponent } from './summmary/summmary.component';


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
    AsideComponent,
    ContactsComponent,
    BoardComponent,
    AddTaskContainerComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    SummmaryComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  protected readonly SectionType = SectionType;
  protected currentSection: SectionType = SectionType.SUMMARY;

  changeSection(section: SectionType) {
    this.currentSection = section;
  }
}