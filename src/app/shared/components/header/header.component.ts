import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output, output, OutputEmitterRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SectionType } from '../../enums/section-type';

@Component({
  selector: 'header[app-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() selectedSection = new EventEmitter<SectionType>();
  protected modalService = inject(ModalService);

  isMenuVisible = false;

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  logout(): void {
    console.log('User logged out');
    this.closeMenu();
  }

  closeMenu(): void {
    this.isMenuVisible = false;
  }

  openPrivacy() {
    this.selectedSection.emit(SectionType.PRIVACY);
    this.closeMenu();
  }

  openLegal() {
    this.selectedSection.emit(SectionType.LEGAL);
    this.closeMenu();
  }

  openHelpFromMenu() {
    this.closeMenu(); // Menü zuerst schließen
    this.modalService.openHelpModal(); // Dann Modal öffnen
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.closeMenu();
    }
  }
}