import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/** Shows a message for user experience. */
export class ToastMsgService {
  toasts: { message: string; duration: number; type: 'success' | 'error' }[] = [];

  /**
   * Pushes a new message in the toast array.
   * @param message - Message to show.
   * @param duration - Duration-time (ms) for show of message (default: 3000ms).
   * @param type - Type of message, error or success.
   */
  add(message: string, duration: number = 3000, type: 'success' | 'error' = 'success') {
    this.toasts.push({ message, duration, type });
    setTimeout(() => this.remove(this.toasts.length - 1), duration);
  }

  /**
   * Removes a message from array.
   * @param index - Index of message in array.
   */
  remove(index: number) {
    this.toasts.splice(index, 1);
  }
}