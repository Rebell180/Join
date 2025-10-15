import { Component, output, OutputEmitterRef } from '@angular/core';
import { SectionType } from '../../shared/enums/section-type';
import { CommonModule } from '@angular/common';
import { NavItemComponent } from './nav-item/nav-item.component';


export interface NavItemData{
    sectionId: string,
    title: string,
    imagePath: string,
    section: SectionType,
    active: boolean
}

@Component({
  selector: 'aside[app-aside]',
  imports: [CommonModule, NavItemComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  protected items: NavItemData[] = [ 
      {
      sectionId: 'Summary',
      title: 'Summary',
      imagePath: 'assets/Icons/Summary.png',
      section: SectionType.SUMMARY,
      active: false
      },
      {
      sectionId: 'addTask',
      title: 'Add task',
      imagePath: 'assets/Icons/addTask.png',
      section: SectionType.TASK,
      active: false,
      },
      {
      sectionId: 'Boards', 
      title: 'Boards',
      imagePath: 'assets/Icons/Board.png',
      section: SectionType.BOARD,
      active: true,
      },
      {
      sectionId: 'Contacts', 
      title: 'Contacts',
      imagePath: 'assets/Icons/Contacts.png',
      section: SectionType.CONTACT,
      active: false
      }
    ];
    selectedSection: OutputEmitterRef<SectionType> = output<SectionType>();

    selectSection(index:number) {
      this.items.forEach((item, i) => {
        item.active = false;
        if (i == index) item.active = true;
      });
      this.selectedSection.emit(this.items[index].section)
    }
}
