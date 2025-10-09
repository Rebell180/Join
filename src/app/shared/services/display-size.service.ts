import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum DisplayType {
  NONE,
  SMART,
  MOBILE,
  TABLET,
  NOTEBOOK,
  DESKTOP,
  BIGSCREEN
}

@Injectable({
  providedIn: 'root'
})
export class DisplaySizeService {
  // #region Attributes
  private sizes: {
    smart: number,
    mobile: number,
    tablet: number,
    notebook: number,
    desktop: number,
    bigscreen: number,
  } =  {
    smart: 450,
    mobile: 640,
    tablet: 768,
    notebook: 1024,
    desktop: 1025,
    bigscreen: 1920,
  }

  private curSizeBS: BehaviorSubject<DisplayType> = new BehaviorSubject<DisplayType>(DisplayType.NONE);
  private curSize$:Observable<DisplayType> = this.curSizeBS.asObservable();

  // #endregion
  constructor() { }

  /**
   * gets current size.
   * @returns - Current size as Obervable
   */
  size(): Observable<DisplayType> {return this.curSize$}
}
