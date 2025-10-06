import { Component } from '@angular/core';
import { ToastMsgService } from '../services/toast-msg.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  constructor(public toastMsgService: ToastMsgService) {}

  showToast() {
    this.toastMsgService.add('This is a toast message.');
  }

  removeToast(index: number) {
    this.toastMsgService.remove(index);
  }
}
