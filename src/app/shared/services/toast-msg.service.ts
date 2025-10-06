import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastMsgService {
  toasts: { message: string; duration: number; type: 'success' | 'error' }[] = [];

  constructor() {
  }
 
  add(message: string, duration: number = 300000, type: 'success' | 'error' = 'success') {
    this.toasts.push({ message, duration, type });
    setTimeout(() => this.remove(this.toasts.length - 1), duration);
  }

  remove(index: number) {
    this.toasts.splice(index, 1);
  }
}