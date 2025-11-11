import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SectionType } from '../../enums/section-type';

@Component({
  selector: 'header[app-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() selectedSection = new EventEmitter<SectionType>();
  protected modalService = inject(ModalService);

  isMenuVisible = false;

  private _docClickListener: ((evt: Event) => void) | null = null;

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
    this.closeMenu();
    this.modalService.openHelpModal();
  }

  ngOnInit(): void {
    this._docClickListener = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target || !target.closest('.profile-container')) {
        this.closeMenu();
      }
    };
    document.addEventListener('click', this._docClickListener, true);
  }

  ngOnDestroy(): void {
    if (this._docClickListener) {
      document.removeEventListener('click', this._docClickListener, true);
      this._docClickListener = null;
    }
  }
}