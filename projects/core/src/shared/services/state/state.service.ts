/**
 * @license
 * Copyright Bolt Insight Limited. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of Bolt Insight Limited.
 * Any reproduction of this material must contain this notice.
 */

import {Injectable} from '@angular/core';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class StateService {

  public _state: InternalStateType = {};

  // already return a clone of the current state
  public get state() {
    return this._state = this._clone(this._state);
  }

  // never allow mutation
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  public clear() {
    this._state = {};
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }
}
