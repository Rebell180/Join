import { Component, inject } from '@angular/core';
import { ToastMsgService } from '../services/toast-msg.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  protected tms: ToastMsgService = inject(ToastMsgService);

  /** Shows the toast. */
  showToast() {
    this.tms.add('This is a toast message.');
  }

  /**
   * Removes a toast.
   * @param index - Index in ToastMsgService massge array.
   */
  removeToast(index: number) {
    this.tms.remove(index);
  }
}
