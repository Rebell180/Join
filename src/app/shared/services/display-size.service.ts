import { Injectable } from '@angular/core';

export enum DisplayType {
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
  // #endregion
  constructor() { }
}
