import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class MyHttpLogInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // There may be other events besides the response.
        if (event instanceof HttpResponse) {
          console.log('processing response', event);
          // cache.put(req, event); // Update the cache.
        }
      })
    );
  }
}



