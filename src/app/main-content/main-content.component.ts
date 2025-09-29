import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { AsideComponent } from "./../../app/main-content/aside/aside.component";
import { AddTaskContainerComponent } from "./add-task-container/add-task-container.component";
import { SectionType } from '../shared/enums/section-type';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
    AsideComponent,
    AddTaskContainerComponent
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