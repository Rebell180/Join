import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, map, Observable, shareReplay, startWith, Subscription } from 'rxjs';

export enum DisplayType {
  NONE = 'none',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  NOTEBOOK = 'notebook',
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
    notebook: number,
    desktop: number
  } =  {
    mobile: 450,
    tablet: 768,
    notebook: 1024,
    desktop: 1920
  }

  private curSizeBS: BehaviorSubject<DisplayType> = new BehaviorSubject<DisplayType>(DisplayType.NONE);
  private curSize$:Observable<DisplayType> = this.curSizeBS.asObservable();

  private resizeSub?: Subscription;
  private resize$: Observable<number> = fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth),
      startWith(window.innerWidth),
      shareReplay(1)
    );;

  // #endregion
  constructor() { 
    this.resize$.subscribe(size => this.adustSize(size));
  }

  // #region Methods
  /** Unssubsribes all subscriptions. */
  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
  }

  /**
   * gets current size.
   * @returns - Current size as Obervable
   */
  size(): Observable<DisplayType> {return this.curSize$}

  /**
   * Gets the current DiplayType without live changes.
   * 
   * @returns the current DisplayType
   */
  getSizeValue(): DisplayType {
    return this.curSizeBS.value;
  }

  /** Detects the current display size.
   * @param displaySize - Width (px) of current display.
   */
  private adustSize(displaySize:number) {
    if (displaySize > this.sizes.desktop) this.curSizeBS.next(DisplayType.BIGSCREEN);
    else if (displaySize > this.sizes.notebook) this.curSizeBS.next(DisplayType.DESKTOP);
    else if (displaySize > this.sizes.tablet) this.curSizeBS.next(DisplayType.NOTEBOOK);
    else if (displaySize > this.sizes.mobile) this.curSizeBS.next(DisplayType.TABLET);
    else this.curSizeBS.next(DisplayType.MOBILE);
  }
  // #endregion
}