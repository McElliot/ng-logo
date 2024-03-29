/**
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as FileSaver from 'file-saver';
import {ExcelWriter} from './excel-writer.model';
import {CvsWriter} from './cvs-writer.model';
import {Util} from '@logo-software/core';

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
 *       variablePath: 'id',
 *       hidden: true
 *     },
 *     {
 *       display: 'Code',
 *       variablePath: 'code',
 *     },
 *     {
 *       display: 'Address',
 *       variablePath: 'recipient.address',
 *     },
 *     {
 *       display: 'Name',
 *       variablePath: 'user.name',
 *     },
 *     {
 *       display: 'Surname',
 *       variablePath: 'user.surname',
 *     }
 *   ],
 *   data: [
 *     {id: 1, code: 123213, recipient: {address: 'Doğruluk sok. 8/10 Ankara'}, user: {name: 'Serkan', surname: 'Konakcı'}},
 *     {id: 2, code: 2134, recipient: {address: 'Ateş sok. 3/5 İstanbul'}, user: {name: 'Seda', surname: 'Sayan'}},
 *     {id: 3, code: 456456, recipient: {address: 'Kıvılcım apt. 5/23 Konya'}, user: {name: 'Banu', surname: 'Alkan'}},
 *   ]
 * };
 */

export class ExcelTableColumn {
  display: string;
  variablePath: string;
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
  columns?: ExcelTableColumn[];
  data?: any[];
  status?: boolean;
  header?: string[] | null;
  name?: string;
  service?: RequestOptions<any>;
  type?: string;
  complete?: Function;
}

@Component({
  selector: 'logo-excel',
  template: `
      <ng-container *ngIf="status">
          <span #content (click)="download()"><ng-content></ng-content></span>
          <button *ngIf="!contentExist" (click)="download()">Excel</button>
      </ng-container>
  `,
  styles: []
})
export class ExcelComponent implements AfterViewInit {
  @Input() public columns: ExcelTableColumn[];
  @Input() public data: any[] = [];
  @Input() public status = true;
  @Input() public header: string[] = null;
  @Input() public name = `Export`;
  @Input() public service: RequestOptions<any> = {
    url: null,
    method: 'GET',
    body: [],
    headers: new HttpHeaders(),
    withCredentials: true,
    params: new HttpParams()
  };
  @Input() public type = 'xls';
  @Output() public complete: EventEmitter<any> = new EventEmitter();
  @ViewChild('content', {static: false}) public contentContainer: ElementRef;
  public contentExist = false;

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
    (response && this.type !== 'csv') ? this.excelSaver(response) : this.csvSaver(response);
  }

  excelDataMaintenance(data: any) {
    return data.map((item: any) => {
      const push: any = {};
      this.columns.forEach((column: ExcelTableColumn) => {
        if (!column.hidden) {
          push[column.display] = Util.getObjectPathValue(item, column.variablePath);
        }
      });
      return push;
    });
  }

  cvsDataMaintenance(data: any) {
    return data.map((item: any) => {
      return this.columns.map((column: any) => {
        return Util.getObjectPathValue(item, column.variablePath);
      });
    });
  }

  excelSaver(value: any) {
    const xmlSheet = new ExcelWriter().xlsTo(this.excelDataMaintenance(value), this.header);
    const blob = new Blob([xmlSheet], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
    this.fileSaver(blob, 'xls');
  }

  csvSaver(value: any) {
    const cvsSheet = new CvsWriter(this.cvsDataMaintenance(value), this.header).toCvs();
    const blob = new Blob([cvsSheet], {type: 'text/csv;charset=utf-8;'});
    this.fileSaver(blob, 'csv');
  }

  fileSaver(blob: any, type: string) {
    FileSaver.saveAs(blob, `${this.name} - ${new Date().toISOString().slice(0, -5)}.${type}`);
  }
}
