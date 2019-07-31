import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {retry, tap} from 'rxjs/operators';
import {StorageClass} from '~/shared/services/storage/storage.service';
import {Observable, throwError} from 'rxjs';
import {LoggerService} from '~/shared/services/logger/logger.service';
import {User} from '~/shared/components/user/user';
import {ToastService} from '~/shared/components/toast/toast.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const login: { [key: string]: User } = StorageClass.getItem('login');
    const token = login && login.user && login.user.token;
    const first = req.headers.get('token');
    let header = {};
    if (first !== 'false') {
      header = {headers: req.headers.set('Authorization', `Bearer ${token}`)};
    }
    const newRequest = req.clone(header);
    // return next.handle(newRequest).pipe(retry(1), catchError(this.handleError));
    return next.handle(newRequest).pipe(retry(0), tap(
      // Log the result or error
      data => LoggerService.log(data),
      error => {
        LoggerService.log(error);
        return this.handleError(error);
      }
    ));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    this.toastService.error(errorResponse.error.message);
    // if (errorResponse.error instanceof ErrorEvent) {
    //   console.error('An error occurred:', errorResponse.error.message);
    // } else {
    //   console.error(
    //     `Backend returned code ${errorResponse.status}, ` +
    //     `body was: ${errorResponse.error}`
    //   );
    // }
    // return throwError('Something bad happened; please try again later.');
    return throwError(errorResponse);
    // return error;
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
];
