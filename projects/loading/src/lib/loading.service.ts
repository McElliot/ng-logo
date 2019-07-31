import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class LoadingService {
  public debug = false;
  public watch: EventEmitter<any> = new EventEmitter();
  public count: boolean[] = [];

  status(value: boolean, url?: string) {
    value ? this.count.push(value) : this.count.splice(0, 1);
    if (this.debug) {
      console.log(url, value, this.count);
    }
    this.watch.emit(value);
  }
}
