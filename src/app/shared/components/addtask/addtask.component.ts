import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.scss'
})
export class AddtaskComponent implements OnInit {



  ngOnInit() {

  }

  /**
   * Submit the entered data as new Task to DB
   *  
   * @param e event
   */
  async submitForm(e: SubmitEvent) {
    console.log('submit');
  }

  /**
   * Reset all inputs to default.
   */
  clear() {

  }

}
