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
  constructor() { 
    this.adustSize();
  }

  /**
   * gets current size.
   * @returns - Current size as Obervable
   */
  size(): Observable<DisplayType> {return this.curSize$}

  /** Detects the current display size. */
  private adustSize() {
    const displaySize:number = window.innerWidth;
    if (displaySize >= this.sizes.bigscreen) this.curSizeBS.next(DisplayType.BIGSCREEN);
    else if (displaySize >= this.sizes.desktop) this.curSizeBS.next(DisplayType.DESKTOP);
    else if (displaySize >= this.sizes.tablet) this.curSizeBS.next(DisplayType.NOTEBOOK);
    else if (displaySize >= this.sizes.mobile) this.curSizeBS.next(DisplayType.TABLET);
    else if (displaySize >= this.sizes.smart) this.curSizeBS.next(DisplayType.MOBILE);
    else this.curSizeBS.next(DisplayType.SMART);
  }
}
