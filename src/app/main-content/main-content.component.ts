import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FireTestComponent } from './fire-test/fire-test.component';

@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
    FireTestComponent
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