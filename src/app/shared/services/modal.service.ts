import { ApplicationRef, createComponent, inject, Injectable, Injector } from '@angular/core';
import { AddContactComponent } from '../components/modals/add-contact/add-contact.component';
import { Contact } from '../classes/contact';
import { AddtaskComponent } from '../components/add-task/add-task.component';
import { AddTaskModalComponent } from '../components/modals/add-task-modal/add-task-modal.component';
import { HelpModalComponent } from '../components/modals/help-modal/help-modal.component';
import { Task } from '../classes/task';
import { TaskModalComponent } from '../components/modals/task-modal/task-modal.component';
import { PrivacyPoliceModalComponent } from '../components/modals/privacy-police-modal/privacy-police-modal.component';
import { LegalNoticeModalComponent } from '../components/modals/legal-notice-modal/legal-notice-modal.component';

/**
 * ModalService is a modal factory service. 
 * At this place you can handle all modals. 
 * 
 * Explanation :
 * 
 * If you want to add a new modal there are a few things to know. 
 * At first create a method like 'openAddContactModal()'. Feel free to submit parameters in here. 
 * Inside of your method you can follow these steps: 
 * 
 * (1) create a modal component reference: 
 *     const componentRef = createComponent([ModalComponentClass], {
 * 
 *        environmentInjector: this.appRef.injector,    // You need environmentInjector, if your modal use global services.
 *                                                      // defines, in wich injector-context the modal should live => our App (provideIn root)
 *                                                      // access to all global services, pipes, directives. No need of extra providers.
 * 
 *        elementInjector: this.injector                // You need elementInjector, if you want du submit parameters or providers or local services.
 *     })
 * 
 * (2) setting inputs of modal component: 
 *      componentRef.setInput('name of input', value);  // if you use @InputSignals
 *      componentRef.instance.nameOfInput = value;      // if you use @Input
 *    
 * (3) define a closing callback function 
 *      In your modal component you need a arrow-function you can set here like:
 *      dissolve?: () => void;   => (dissolve)is the name, (?:) it could be null, ( () => void ) default arrow function 
 *      In addition to that you call this function on your closeModal()-method.
 * 
 *      Here you can define what happened if the callback function is called:
 *      componentRef.instance.dissolve = () => {            // over componentRef.instance.callbackname you can set the method
 *        this.appRef.detachView(componentRef.hostView);    // removes modal component from app
 *        componentRef.destroy();                           // destroy the component itself
 *      }
 * 
 * (4) add modal component to your view: 
 *      Last but not least you have to add your component to your view. 
 * 
 *      this.appRef.attachView(componentRef.hostView);                    // appRef is your application and attachView tells angular
 *                                                                        // that you want to register your new component to change detection cyclus.
 *                                                                        // without that your component would'nt update neither observables or signals.
 *      document.body.appendChild(componentRef.location.nativeElement);   // after register your component you add it to your target component
 *                                                                        // default for modals are the body.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // #region properties

  private appRef: ApplicationRef = inject(ApplicationRef);
  private injector: Injector = inject(Injector);

  // #endregion properties


  // #region methods

  /**
   * Opens the add or edit contact modal. 
   * * @param kindOf kind of modal ('add' contact or 'edit' contact)
   * @param contact contact to add or edit.
   */
  openAddContactModal(kindOf: 'add' | 'edit', contact: Contact) {
    // (1) creates a modal component reference
    const componentRef = createComponent(AddContactComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // (2) set the @Inputs for component
    if (kindOf === 'add') {
      componentRef.setInput('headlineTxt', 'Add');
      componentRef.setInput('submitBtnTxt', 'Create contact ✓');
    } else {
      componentRef.setInput('headlineTxt', 'Edit');
      componentRef.setInput('submitBtnTxt', 'Save ✓');
    }
    componentRef.setInput('contact', contact);

    // (3) define a closing callback function
    componentRef.instance.dissolve = () => {
      this.appRef.detachView(componentRef.hostView); // removes modal component from app
      componentRef.destroy();                       // destroy the component itself
    }

    // (4) add modal component to your view
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  } // <--- openAddContactModal is now correctly closed here

  /**
   * Opens the detail view for a task.
   * NOTE: The original code was syntactically incorrect and used AddContactComponent.
   * This version uses a new, more appropriate TaskDetailComponent.
   * @param kindOf kind of modal ('task')
   * @param task the task object to display.
   */
  openTaskDetailModal(task: Task) {
    // (1) creates a modal component reference
    const componentRef = createComponent(TaskModalComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // (2) set the @Inputs for component
    componentRef.setInput('task', task); // <--- Correct input assignment

    // (3) define a closing callback function
    componentRef.instance.dissolve = () => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }

    // (4) add modal component to your view
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }



  /**
   * Opens the add task modal. 
   * 
   */
  openAddTaskModal() {
    // creates a component
    const componentRef = createComponent(AddTaskModalComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // set the @Inputs for component

    // callback function if call close modal
    componentRef.instance.dissolve = () => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }

    // (4) add modal component to your view
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }

  /**
   * Opens the help modal. 
   * 
   */
  openHelpModal() {
    // creates a component
    const componentRef = createComponent(HelpModalComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // set the @Inputs for component

    // callback function if call close modal
    componentRef.instance.dissolve = () => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    };

    // add component to body
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }


openPrivacyPolicyModal() {
  // creates a component
  const componentRef = createComponent(PrivacyPoliceModalComponent, {
    environmentInjector: this.appRef.injector,
    elementInjector: this.injector
  });

  // set the @Inputs for component

  // callback function if call close modal
  componentRef.instance.dissolve = () => {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
};

    // add component to body
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }

  openLegalNoticeModal() {
  // creates a component
  const componentRef = createComponent(LegalNoticeModalComponent, {
    environmentInjector: this.appRef.injector,
    elementInjector: this.injector
  });

  // set the @Inputs for component

  // callback function if call close modal
  componentRef.instance.dissolve = () => {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
};

    // add component to body
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }
}

  // #endregion method
