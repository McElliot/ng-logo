import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as FileSaver from 'file-saver';
import {ExcelWriter} from './excel-writer.model';
import {CvsWriter} from './cvs-writer.model';
import {Util} from '@logo/core';

/**
 * @Input() data: any - Will be displayed data source
 * @Input() columns:  TableColumns[] - Definitions of the columns and variables will be displayed
 * @Input() header: string[] - Excel column header names
 * @Input() name: string[] - Exported file name
 * @Input() status: boolean - default true if set to false excel export will not triggered.
 * @Input() service: RequestOptions - If set data will be requested from RESTful API address
 * @Output() complete: Function - It will be triggered when data received, it will triggered before de export.
 *
 *  ### Excel Usage Sample:
 *
 * <excel
 * (complete)="excelComplete()"
 * [data]="excelSample.data"
 * [columns]="excelSample.column"
 * [header]="excelSample.header"
 * [name]="excelSample.fileName"
 * >
 * </excel>
 *
 * ### Example Data will be displayed:
 *
 * excelSample = {
 *   fileName: 'ExcelFile',
 *   header: ['CODE', 'ADDRESS', 'NAME', 'SURNAME'],
 *   column: [
 *     {
 *       display: 'ID',
 *       variable: 'id',
 *       hidden: true
 *     },
 *     {
 *       display: 'Code',
 *       variable: 'code',
 *     },
 *     {
 *       display: 'Address',
 *       variable: 'recipient.address',
 *     },
 *     {
 *       display: 'Name',
 *       variable: 'user.name',
 *     },
 *     {
 *       display: 'Surname',
 *       variable: 'user.surname',
 *     }
 *   ],
 *   data: [
 *     {id: 1, code: 123213, recipient: {address: 'Doğruluk sok. 8/10 Ankara'}, user: {name: 'Serkan', surname: 'Konakcı'}},
 *     {id: 2, code: 2134, recipient: {address: 'Ateş sok. 3/5 İstanbul'}, user: {name: 'Seda', surname: 'Sayan'}},
 *     {id: 3, code: 456456, recipient: {address: 'Kıvılcım apt. 5/23 Konya'}, user: {name: 'Banu', surname: 'Alkan'}},
 *   ]
 * };
 */

export class TableColumn {
  display: string;
  variable: string;
  hidden?: boolean;
}

export enum ResponseContentEnum {
  Text = 'text',
  Json = 'json',
  ArrayBuffer = 'arraybuffer',
  Blob = 'blob'
}

export interface RequestOptions<T> {
  method?: string;
  url?: string | null | undefined;
  headers?: any;
  body?: any;
  params?: HttpParams | any;
  withCredentials?: boolean;
  responseType?: ResponseContentEnum;
}

export interface ExcelSettingType {
  service: RequestOptions<any>;
  status?: Boolean;
  data?: any[];
  columns?: TableColumn[];
  header?: any[] | null;
  name?: string;
  type?: string;
}

@Component({
  selector: 'excel',
  template: `
    <div (click)="download()">
      <div #content>
        <ng-content></ng-content>
      </div>
      <button *ngIf="!contentExist">Excel</button>
    </div>
  `,
  styles: []
})
export class ExcelComponent implements AfterViewInit {
  @Input() columns: TableColumn[];
  @Input() data: any[] = [];
  @Input() status = true;
  @Input() header: string[] = null;
  @Input() name = `Export`;
  @Input() service: RequestOptions<any> = {
    url: null,
    method: 'GET',
    body: [],
    headers: new HttpHeaders(),
    withCredentials: true,
    params: new HttpParams()
  };
  @Input() type = 'cvs';
  @Output() complete: EventEmitter<any> = new EventEmitter();
  @ViewChild('content') contentContainer: ElementRef;
  private contentExist = false;

  constructor(public elementRef: ElementRef, private http: HttpClient) {
  }

  ngAfterViewInit() {
    this.contentExist = this.contentContainer.nativeElement.childNodes.length > 0;
  }

  download() {
    const {method, url, ...options} = this.service;
    if (this.status === false && this.columns.length <= 0) {
      console.error('Columns property is empty. Please set columns for work duly.');
    } else {
      if (!!url) {
        this.http.request(method, url, options).subscribe((response) => this.onSuccessHandler(response));
      } else {
        this.onSuccessHandler(this.data);
      }
    }
  }

  onSuccessHandler(response: any) {
    this.complete.emit(response);
    if (response) {
      if (this.type !== 'csv') {
        this.data = this.excelDataMaintenance(response);
        this.excelSaver(response);
      } else {
        this.data = this.cvsDataMaintenance(response);
        this.csvSaver(response);
      }
    }
  }

  excelDataMaintenance(data: any) {
    return data.map((item: any) => {
      const push: any = {};
      this.columns.forEach((column: any) => {
        if (!column.hidden) {
          push[column.display] = Util.get(item, column.variable);
        }
      });
      return push;
    });
  }

  cvsDataMaintenance(data: any) {
    return data.map((item: any) => {
      return this.columns.map((column: any) => {
        return Util.get(item, column.variable);
      });
    });
  }

  excelSaver(value: any) {
    const xmlSheet = new ExcelWriter().xlsTo(this.data, this.header);
    const blob = new Blob([xmlSheet], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
    this.fileSaver(blob, 'xls');
  }

  csvSaver(value: any) {
    const cvsSheet = new CvsWriter(this.data, this.header).toCvs();
    const blob = new Blob([cvsSheet], {type: 'text/csv;charset=utf-8;'});
    this.fileSaver(blob, 'csv');
  }

  fileSaver(blob: any, type: string) {
    FileSaver.saveAs(blob, `${this.name} - ${new Date().toISOString().slice(0, -5)}.${type}`);
  }
}
