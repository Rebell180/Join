import { Component, output, OutputEmitterRef } from '@angular/core';
import { NavItemComponent } from '../../shared/nav-item/nav-item.component';
import { NavItemData } from '../../shared/interfaces/navitemdata';
import { SectionType } from '../../shared/enums/section-type';
import { throwIfEmpty } from 'rxjs';

@Component({
  selector: 'aside[app-aside]',
  imports: [NavItemComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  protected items: {
    sectionId: string,
    title: string,
    imagePath: string,
    section: SectionType
  }[] = [ 
      {
      sectionId: 'Summary',
      title: 'Summary',
      imagePath: 'assets/Icons/Summary.png',
      section: SectionType.SUMMARY
      },
      {
      sectionId: 'addTask',
      title: 'Add task',
      imagePath: 'assets/Icons/addTask.png',
      section: SectionType.TASK
      },
      {
      sectionId: 'Boards', 
      title: 'Boards',
      imagePath: 'assets/Icons/Board.png',
      section: SectionType.BOARD
      },
      {
      sectionId: 'Contacts', 
      title: 'Contacts',
      imagePath: 'assets/Icons/Contacts.png',
      section: SectionType.CONTACT
      }
    ];
    selectedSection: OutputEmitterRef<SectionType> = output<SectionType>();

    selectSection(index:number) {
      this.selectedSection.emit(this.items[index].section)
    }
}
