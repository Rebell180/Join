import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, map, Observable, shareReplay, startWith, Subscription } from 'rxjs';

export enum DisplayType {
  NONE = 'none',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  BIGSCREEN = 'bigscreen'
}

@Injectable({
  providedIn: 'root'
})
export class DisplaySizeService implements OnDestroy{
  // #region Attributes
  private sizes: {
    mobile: number,
    tablet: number,
    desktop: number
  } =  {
    mobile: 450,
    tablet: 768,
    desktop: 1920
  }

  private curSizeBS: BehaviorSubject<DisplayType> = new BehaviorSubject<DisplayType>(DisplayType.NONE);
  private curSize$:Observable<DisplayType> = this.curSizeBS.asObservable();

  private resizeSub?: Subscription;
  private resize$: Observable<number> = fromEvent(window, 'resize').pipe(
      debounceTime(500),
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
    if (displaySize > this.sizes.desktop) this.curSizeBS.next(DisplayType.BIGSCREEN);
    else if (displaySize > this.sizes.tablet) this.curSizeBS.next(DisplayType.DESKTOP);
    else if (displaySize > this.sizes.mobile) this.curSizeBS.next(DisplayType.TABLET);
    else this.curSizeBS.next(DisplayType.MOBILE);
  }
}
// #endregion