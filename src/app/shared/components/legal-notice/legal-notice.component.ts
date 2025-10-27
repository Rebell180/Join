import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'section[legal-notice]',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
