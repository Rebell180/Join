import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { SectionType } from '../../shared/enums/section-type';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../shared/services/modal.service';
import { NavItemComponent } from '../../shared/components/nav-item/nav-item.component';


export interface NavItemData {
      sectionId: string,
      title: string,
      imagePath: string,
      section: SectionType,
      active: boolean
}

export interface LegalLinks {
      sectionId: string,
      title: string,
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
                  imagePath: 'assets/Icons/contact/Summary.png',
                  section: SectionType.SUMMARY,
                  active: true
            },
            {
                  sectionId: 'add-task-section',
                  title: 'Add task',
                  imagePath: 'assets/Icons/contact/addTask.png',
                  section: SectionType.TASK,
                  active: false,
            },
            {
                  sectionId: 'Boards',
                  title: 'Boards',
                  imagePath: 'assets/Icons/contact/Board.png',
                  section: SectionType.BOARD,
                  active: false,
            },
            {
                  sectionId: 'Contacts',
                  title: 'Contacts',
                  imagePath: 'assets/Icons/contact/Contacts.png',
                  section: SectionType.CONTACT,
                  active: false
            },
      ];

      protected itemLegal: LegalLinks[] = [
            {
                  sectionId: 'Privacy',
                  title: 'Privacy Policy',
                  section: SectionType.PRIVACY,
                  active: false
            },
            {
                  sectionId: 'Legal',
                  title: 'Legal Notice',
                  section: SectionType.LEGAL,
                  active: false
            },
      ];
      selectedSection: OutputEmitterRef<SectionType> = output<SectionType>();
      protected modalService: ModalService = inject(ModalService);

      private activateItem<T extends { active: boolean; section: SectionType }>(
            list: T[],
            index: number
      ): void {
            if (index < 0 || index >= list.length) return;
            list.forEach((item, i) => (item.active = i === index));
            this.selectedSection.emit(list[index].section);
      }

      selectSection(index: number): void {
            this.itemLegal.forEach(i => (i.active = false));
            this.activateItem(this.items, index);
      }

      selectLegal(index: number): void {
            this.items.forEach(i => (i.active = false));
            this.activateItem(this.itemLegal, index);
      }
}
