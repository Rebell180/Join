import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, output, OutputEmitterRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SectionType } from '../../enums/section-type';

@Component({
  /* Wenn der Selector so in eckige Klammern gesceiben wird,
   * bedeutet das, die Komponente in ein normales Header-Tag eingebunden wird
   * Der Name der Komponente app-header muss sich dabei vom Tag <header> unterscheien. */
  selector: 'header[app-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedSection: OutputEmitterRef<SectionType> = output<SectionType>();
  protected modalService: ModalService = inject(ModalService);

  isMenuVisible: boolean = false;

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  logout(): void {
    // Hier deine Logout-Logik einbauen
    console.log('User logged out');
    this.isMenuVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.isMenuVisible = false;
    }
  }

  openPrivacy() {
    this.selectedSection.emit(SectionType.PRIVACY);
  }

  openLegal() {
    this.selectedSection.emit(SectionType.LEGAL);
  }
}
