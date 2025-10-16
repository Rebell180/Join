import { Component, output, OutputEmitterRef, signal} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, } from '@angular/forms';

@Component({
  selector: 'app-search-task',
  imports: [ReactiveFormsModule],
  templateUrl: './search-task.component.html',
  styleUrl: './search-task.component.scss'
})
export class SearchTaskComponent {
  protected form: FormGroup = new FormGroup({
    search: new FormControl('')
  });
  private searchSig = signal(this.form.controls['search'].value);
  protected seachOut: OutputEmitterRef<string> = output();

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.searchSig.set(this.form.controls['search'].value);
      this.seachOut.emit(this.form.controls['search'].value);
    })
  }

  /**
   * Gets the userinput und emits it for parent.
   * @param e - Submitevent.
   */
  startSearch(e: Event) {
    e.preventDefault();
    this.seachOut.emit(this.form.controls['search'].value);
  }
}
