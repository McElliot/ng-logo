/**
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {ClickType, CompleteType, ErrorType, SuccessType, WatchType} from './event.types';

export class Events<T> {
  public success: SuccessType;
  public error ?: ErrorType;
  public complete ?: CompleteType;
  public click ?: ClickType;
  public dblclick ?: ClickType;
  public loaded?: WatchType = {
    success: (response: any) => response,
    error: (error: Error) => error,
    complete: () => null
  };
  public drag?: { start?: Function, complete: Function };
  public params: (parameters) => void;

  constructor(events ?: Events<T>) {
    this.success = (response: any) => response;
    this.error = (error: Error) => error;
    this.complete = () => null;
    this.click = (row: any, event?: Event, index?: number) => row;
    this.dblclick = (row: any, event?: Event, index?: number) => row;
    this.drag = {
      start: (response: any) => response,
      complete: (response: any) => response
    };
    if (events) {
      Object.assign(this, events);
    }
  }
}
