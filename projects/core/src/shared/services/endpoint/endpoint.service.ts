import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpParams} from '@angular/common/http/src/params';
import {Observable} from 'rxjs';
import {LoadingService} from '../../../../../loading/src/lib/loading.service';

export enum ResponseContentEnum {
  Text = 'text',
  Json = 'json',
  ArrayBuffer = 'arraybuffer',
  Blob = 'blob'
}

/**
 * Example usage:
 *
 * const reqBody: RequestBody = {
 *   paging: {
 *     size: 15,
 *     page: 3,
 *   },
 *   sort: {
 *     fieldName01: 'ASC',
 *     fieldName01: 'DSC'
 *   },
 *   data: {
 *     name: 'Volkan',
 *     surname: 'Doğan'
 *   }
 * };
 * const option: RequestOption = {body: reqBody};
 * http.request('url', RequestMethod.POST, option); // Bu özellikleri içeren bir request gönderiyoruz.
 */

export class RequestBody {
  public data?: { [key: string]: any };
  public paging?: { size: number; page: number };
  public sort?: { [key: string]: any };
}

export class Paging {
  currentPage: number; //  3 şuanki sayfa
  totalPages: number; // 12 toplam sayfa
  displayRecords: number; // 15 gösterilen kayıt sayısı
  totalRecords: number; // 180 toplam kayıt sayısı
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'POST',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  PATCH = 'PATCH',
}

export enum ResponseBodyStatus {
  OK = 'OK',
  FAIL = 'FAIL',
  UNKNOWN = 'UNKNOWN',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export class ResponseBody<T> {
  status: ResponseBodyStatus;
  data?: T;
  message?: string;
  detail?: string;
  paging?: Paging;
}

export class SuccessResponse<T> {
  type: number;
  body: ResponseBody<T>;
  headers: HttpHeaders;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}

export class ErrorResponse<T> {
  error: ResponseBody<T>;
  errorCode: string;
  name: string;
  message: string;
  headers: HttpHeaders;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}

export interface RequestOption {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  reportProgress?: boolean;
  observe?: any;
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  responseType?: ResponseContentEnum.Json;
  withCredentials?: boolean;
}

interface SubscriptionMethods {
  success: (value: any) => void;
  error?: (error: any) => void;
  complete?: () => void;
}

@Injectable()
export class EndpointService {

  constructor(private http: HttpClient, private loadingService: LoadingService) {
  }

  request(method: string, url: string, options: RequestOption = {}): Observable<any> {
    options.observe = options && options.observe ? options.observe : 'response';
    options.responseType = options.responseType ? options.responseType : ResponseContentEnum.Json;
    const headers = new HttpHeaders(Object.assign({}, {'Content-Type': 'application/json'}, options.headers));
    return this.http.request(method, url, {...options, headers: headers});
  }

  get(url: string, options: RequestOption = {}): Observable<any> {
    options.observe = options && options.observe ? options.observe : 'response';
    options.responseType = options.responseType ? options.responseType : ResponseContentEnum.Json;
    const headers = new HttpHeaders(Object.assign({}, {'Content-Type': 'application/json'}, options.headers));
    return this.http.get(url, {...options, headers: headers});
  }

  post(url: string, body: RequestBody, options: RequestOption = {}): Observable<any> {
    options.observe = options && options.observe ? options.observe : 'response';
    options.responseType = options.responseType ? options.responseType : ResponseContentEnum.Json;
    const headers = new HttpHeaders(Object.assign({}, {'Content-Type': 'application/json'}, options.headers));
    return this.http.post(url, body, {...options, headers: headers});
  }
}
