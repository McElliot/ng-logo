import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Injectable()
export class WatcherService {
  public subject: Subject<any> = new Subject<any>();

  debounce(time?: number) {
    return this.subject.pipe(debounceTime(time));
  }

  next(value?: any) {
    this.subject.next(value);
  }

  subscribe(success: (value: any) => void, error?: (error: any) => void, complete?: () => void) {
    return this.subject.subscribe(success, error, complete);
  }

  unsubscribe() {
    return this.subject.unsubscribe();
  }

  completed() {
    return this.subject.complete();
  }
}
