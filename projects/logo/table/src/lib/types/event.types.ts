/*
* Copyright 2017 HepsiExpress Limited. All Rights Reserved.
*
* Save to the extent permitted by law, you may not use, copy, modify,
* distribute or create derivative works of this material or any part
* of it without the prior written consent of HepsiExpress Limited.
* Any reproduction of this material must contain this notice.
*/

export type ClickType = (value: any, event?: Event, index?: number) => void;
export type SuccessType = (value: any) => any;
export type ErrorType = ((error: Error) => any);
export type CompleteType = (() => any);
export type WatchType = {
  success: SuccessType;
  error?: ErrorType;
  complete?: CompleteType;
};
