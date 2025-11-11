import { AfterViewInit, Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-help-modal',
  imports: [],
  templateUrl: './help-modal.component.html',
  styleUrl: './help-modal.component.scss',
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      state('closed', style({
        transform: 'translateX(100vw)',
        opacity: 0,
      })),
      transition('closed => open', [
        animate('500ms ease-out')
      ]),
      transition('open => closed', [
        animate('400ms ease-in')
      ])
    ])
  ]
})
export class HelpModalComponent implements AfterViewInit{


  /** callback function on close => remove from DOM => will be set in ModalService */
  dissolve?: () => void;

  isOpen = false;

  ngAfterViewInit() {
    setTimeout(() => this.isOpen = true, 10); // Animation trigger
  }

  /**
   * Closes the modal
   * 
   * Use a timeout to defer the close function for animation.
   */
  closeModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 400);
  }

}
