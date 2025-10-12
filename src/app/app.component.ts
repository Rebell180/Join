import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddContactComponent } from "./shared/add-contact/add-contact.component";
import { ToastComponent } from "./shared/toast/toast.component";
import { ContactService } from './shared/services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, AddContactComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';

  cs: ContactService = inject(ContactService);
}
