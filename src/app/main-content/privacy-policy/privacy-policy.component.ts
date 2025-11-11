import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'section[privacy-policy]',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
