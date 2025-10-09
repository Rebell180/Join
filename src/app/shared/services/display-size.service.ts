import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, map, Observable, shareReplay, startWith, Subscription } from 'rxjs';

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
export class DisplaySizeService implements OnDestroy{
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

  private resizeSub?: Subscription;
  private resize$: Observable<number> = fromEvent(window, 'resize').pipe(
      debounceTime(3000),
      map(() => window.innerWidth),
      startWith(window.innerWidth),
      shareReplay(1)
    );;

  // #endregion
  constructor() { 
    this.resize$.subscribe(size => this.adustSize(size));
  }

  // #region Methodes
  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
  }

  /**
   * gets current size.
   * @returns - Current size as Obervable
   */
  size(): Observable<DisplayType> {return this.curSize$}

  /** Detects the current display size. */
  private adustSize(displaySize:number) {
    if (displaySize >= this.sizes.bigscreen) this.curSizeBS.next(DisplayType.BIGSCREEN);
    else if (displaySize >= this.sizes.desktop) this.curSizeBS.next(DisplayType.DESKTOP);
    else if (displaySize >= this.sizes.tablet) this.curSizeBS.next(DisplayType.NOTEBOOK);
    else if (displaySize >= this.sizes.mobile) this.curSizeBS.next(DisplayType.TABLET);
    else if (displaySize >= this.sizes.smart) this.curSizeBS.next(DisplayType.MOBILE);
    else this.curSizeBS.next(DisplayType.SMART);
  }
}
// #endregion