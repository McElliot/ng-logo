/**
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {Component, ContentChild, ElementRef, Input, OnDestroy, OnInit, Renderer2, TemplateRef} from '@angular/core';
import {Events} from './types/event.model';
import {ExcelComponent, ExcelSettingType, ExcelTableColumn} from '@logo/excel';
import {Pager, Paging} from '@logo/paging';
import {EndpointService, ErrorResponse, ResponseBody, Util, WatcherService} from '@logo/core';
import {LanguageService} from '@logo/language';

export type VariablePathResolver = (row: any, column?: TableColumn) => string;
export type VariableDataResolver = (data: any) => any;

/**
 * The Table Meta class is used for type definition.
 */
export class TableMeta<T> {
  service?: { url: string, method: string };
  columns: TableColumn[];
  heads: TableHead[];
  events?: Events<T>;
  actions?: { [key: string]: TableAction };
  mapPath?: string | null;
  status?: boolean;
  list?: any[];
  rows: any[];
}

/**
 * @Input thead usage
 * This input adds custom extra thead to and tbody columns to table.
 * If custom coded html need to be inserted between table columns, this is the solution.
 * Add some HTML to between app-table tag using '<template let-i="index" let-row="row" let-last="isLast" let-odd="isOdd">' tags.
 *
 * 2 options can be set
 * "thead.className" is used for set style class name
 * "thead.display" is for thead visible text
 *
 * Usage example:  this.unassigned.theads: [{display: 'Onay', className:'some-class-name'}]
 * Usage example for html side:
 * <app-table
 *  [automatic]="false"
 *  [columns]="unassigned.columns"
 *  [theads]="unassigned.theads"
 *  [hasFilter]="false"
 *  [hasPaging]="false"
 *  [height]="'600px'"
 *  #unassignedTable
 * >
 * <ng-template let-i="index" let-row="row" let-last="isLast" let-odd="isOdd">
 *  <td>
 *    Number: {{i}} and isLast: {{last}} and isOdd: {{odd}}
 *    <select (change)="addChangeList($event, row)">
 *      <option [ngValue]='null' disabled selected hidden>{{"select" | translate}}</option>
 *      <option
 *        *ngFor="let item of district.list"
 *        [value]="item.id"
 *        [selected]="district.selected && district.selected.id===item.id"
 *      >
 *        {{item.name}}
 *      </option>
 *    </select>
 *  </td>
 *  </ng-template>
 * </app-table>
 */
export class TableHead {
  display = '';
  className = '';
}

/**
 * Sorting requirements
 */
export class TableSorting {
  column: string | VariablePathResolver;
  descending: boolean;
  status: boolean;
}

/**
 * @Input column usage
 * TableColumn class used for define table header properties
 *
 * @prop {String} [display=''] - Visible text, this text will be translate by language file array
 * @prop {String | function} [variablePath=''] - this prop used for set Rest Service return json prop path.
 * This property can also be assigned as a function. If use as a function, it must return object path again.
 * For example: Rest service return {person: {name: 'serkan', surname: 'konakcı'}} and you want to display surname on this column
 * you must to set the variablePath field value to 'person.surname' Sample: column.variablePath = 'person.surnaname'
 * @prop {String} [filter=''] - format of the Pipe types {text | date | percentage | decimal | datetime | number }
 * @prop {boolean} [filterDisable=false] if it is true filter of the thead will be disabled input textbox
 * @prop {function} [classFunction] method used for return class name
 * @prop {function} [variableFunction] method used for change data before return
 * @prop {string} sortingKey  - If you use different sorting then variablePath use this property.
 * Ex: {..., variablePath: 'user.name', sortingKey: 'user.surname'} it will sort by user.surname instead of user.name
 * For example
 */
export class TableColumn {
  display = '';
  variablePath?: VariablePathResolver | string;
  variableFunction?: VariableDataResolver;
  filter?: string | 'text' | 'percentage ' | 'decimal' | 'datetime' | 'number' | 'date' | null = 'text';
  filterDisable ? = false;
  hidden ? = true;
  className?;
  classFunction ?: VariablePathResolver;
  sortable ? = false;
  sortingKey?: string;
}

/**
 * @Input actions usage
 * You can set table actions from another component with this.table.actions
 * Usage example can be found in distributionzone-create.component.ts. Sample usage is:
 * const actions = { newButton: { display: 'new', click: () => this.openSaveModal(), className: 'primary', disable: false } }
 * this.table.actions = [ actions.newButton ]
 */
export class TableAction {
  public click: any;
  public display: string;
  public disable ? = false;
  public className ?: string;
}

/**
 * @version 1.2.1
 * @Input sort usage
 * The sort input used for sorting table. Default value is true
 * If you want to show table sorting as BE return value are, set this value to false
 *
 * @prop {WatchService} [loaded = new WatchService()] - when table load completed this method can be call.
 * WatchService get tree function this.loaded.success, this.loaded.error and this.loaded.completed
 *
 * @prop {Boolean} refButtonStatus - This property hide or show reference buttons (+ and - buttons)
 */
@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() public reference: TableComponent;
  @Input() public refButtonStatus = true;
  @Input() public mapPath: string | null = null;
  @Input() public automatic = true;
  @Input() public multiselect = false;
  @Input() public theads: TableHead[] = [];
  @Input() public refresh = false;
  @Input() public pageSize = 10;
  @Input() public hasPaging = true;
  @Input() public hasFilter = true;
  @Input() public rows: any[] = [];
  @Input() public index = false;
  @Input() public indexStart = 0;
  @Input() public sticky = true;
  @Input() public sort = false; // table sorting feature parameter.
  @Input() public serverSide = true; // table sorting side parameter
  @Input() public height = '500px';
  @Input() public actions: TableAction[] = [];
  @Input() public service: { url: string | null, method: string } = {url: null, method: 'GET'};
  @Input() public excel: ExcelSettingType = {
    service: {
      url: null,
      method: 'GET',
      // success: (response: any) => null
    }
  };
  @ContentChild(TemplateRef) templateRef: any;
  @Input() public draggable = false;
  public orginal: any[] | null = null;
  @Input() events: Events<any> = new Events();
  public stickyInitialized = false;
  public loaded: WatcherService = new WatcherService();
  public paging: Paging = {
    pageSize: 10,
    pageNumber: 0,
    totalCount: 0,
    totalPages: 0
  };
  public list: any[] = [];
  public sorting: { column: string | VariablePathResolver, descending: boolean, status: boolean } = {
    column: '',
    descending: false,
    status: this.sort
  };
  public filter ? = {};
  public body: any = {};
  public interval: { status: boolean, time: number } = {status: false, time: 30000};
  public timeout: number;
  public drag: { start: boolean, list: any[] } = {start: false, list: []};
  private exporter: ExcelComponent;
  private filterDebounce = new WatcherService();
  private clickDelay: number = null;

  constructor(public elementRef: ElementRef, private api: EndpointService,
              private language: LanguageService,
              // TODO private loadingService: LoadingService,
              public renderer: Renderer2) {
    // TODO this.exporter = new ExcelGetter(this.api);
  }

  private _columns: TableColumn[] = [];

  @Input() get columns(): TableColumn[] {
    return this._columns;
  }

  set columns(value: TableColumn[]) {
    this._columns = value;
    this.excel.columns = <ExcelTableColumn[]>value;
  }

  private _selected: any = null;

  get selected(): any {
    return this._selected;
  }

  set selected(value: any) {
    this.list.push(value);
    this._selected = value;
  }

  ngOnInit() {
    // TODO this.loadingService.status(true, 'table init');
    this.paging.pageSize = this.pageSize;
    this.sorting.status = this.sort;
    this.service.method = this.service.method || 'GET';
    // TODO debounce time could be set outside of the component
    this.filterDebounce.debounce(1000).subscribe((value) => this.setFilter(value));
    this._columns = this._columns.map((item: TableColumn) => {
      item.filter = item.filter ? item.filter : 'text';
      return item;
    });
    if (this.automatic && !this.reference) {
      this.load();
    }
    if (this.interval.status) {
      console.log('########################### Remove This');
      this.reload();
    }
    this.excel = {
      status: !!this.excel.status,
      columns: this._columns as ExcelTableColumn[],
      name: !!this.excel.name ? this.excel.name : this.language.translate('excel'),
      service: {
        url: this.service.url,
        method: this.service.method,
        // TODO success: !!this.excel.service && !!this.excel.service.success ? this.excel.service.success : this.events.success
      },
      type: this.excel.type || 'xls'
    };
  }

  ngOnDestroy() {
    if (this.interval.status) {
      this.reloadCancel();
    }
    this.filterDebounce.unsubscribe();
    this.reset();
  }

  getNewExcelOptions() {
    const options: ExcelSettingType = {
      data: this.rows,
      service: {
        url: this.service.url,
        method: this.service.method,
        body: {
          data: this.filter
        },
        // TODO success: this.events.success
      }
    };
    this.excel = {...this.excel, ...options};
  }

  excelExport() {
    this.excel.data = this.rows;
    return this.exporter.download();
  }

  reload() {
    this.timeout = window.setInterval(() => {
      this.load();
    }, this.interval.time);
  }

  reloadCancel() {
    clearInterval(this.timeout);
  }

  setTheadClass(column: TableColumn): string | boolean {
    const classes = [];
    if (column.className) {
      classes.push(column.className);
    }
    if (this.sort) {
      if (column.variablePath === this.sorting.column || column.sortingKey === this.sorting.column) {
        classes.push(`sort-${this.sorting.descending ? 'desc' : 'asc'}`);
      } else if (column.sortable) {
        classes.push(`sort`);
      }
    }
    return classes.join(' ');
  }

  setTdClass(row: any, column: TableColumn) {
    const classes = [];
    if (column.className) {
      classes.push(column.className);
    }
    if (!!column.classFunction) {
      const className = column.classFunction(row, column);
      if (className) {
        classes.push(className);
      }
    }
    return classes;
  }

  changeSortingByColumn(column: TableColumn): void {
    if (column.sortable) {
      const sort: TableSorting = this.sorting;
      if (sort.column === column.variablePath || sort.column === column.sortingKey) {
        sort.descending = !sort.descending;
      } else {
        sort.column = column.sortingKey ? column.sortingKey : column.variablePath;
        sort.descending = true;
      }
      this.load();
    }
  }

  orderBy() {
    return (!this.serverSide && this.sort) ? this.sorting : false;
  }

  objectPathValue(row: any, column: TableColumn) {
    const path: string = (typeof (column.variablePath) === 'function') ? column.variablePath(row, column) : column.variablePath;
    let data: any = row;
    data = Util.getObjectPathValue(data, path);
    if (!!column.variableFunction) {
      data = column.variableFunction(data);
    }
    return data;
  }

  filterAdd(property: any, value: string) {
    property = Util.type(property) === 'Function' ? property(this.rows[0]) : property;
    const object = {...this.filter, ...Util.setObjectPathValue(property, value)};
    this.filterDebounce.next(Util.clearNullAndUndefined(object, true));
  }

  setFilter(filter: any) {
    this.filter = filter;
    this.paging.pageNumber = 0; // !(<any>this.filter).isNull() ? 0 : this.paging.pageNumber;
    this.load();
  }

  clientSideLoading() {
    this.orginal = this.orginal || this.rows;
    const startIndex = this.paging.pageNumber * this.paging.pageSize;
    const filtered = JSON.parse(JSON.stringify(this.orginal && Util.findAllObjectInArray(this.orginal, this.filter, false)));
    this.rows = filtered.slice(startIndex, startIndex + this.paging.pageSize);
    this.paging.totalCount = filtered.length;
  }

  serverSideLoading() {
    // TODO this.loadingService.status(true, `${this.service.url} - table start`);
    this.api.request(this.service.method, this.service.url, {
      body: {
        data: this.filter,
        pageNumber: this.paging.pageNumber,
        pageSize: this.paging.pageSize,
        sortList: this.getSort(),
        ...this.body
      }
    }).subscribe(
      (response: ResponseBody<any>) => this.onLoadSuccessHandler(response),
      (error: ErrorResponse<any>) => this.onLoadErrorHandler(error)
    );
  }

  load() {
    (this.serverSide && !!this.service.url) ? this.serverSideLoading() : this.clientSideLoading();
  }

  rendered(row?: any) {
    // TODO this.loadingService.status(false, `${this.service.url} - table complete - rows: ${row}`);
    this.loaded.next(this.rows);
  }

  getSort() { // TODO: ileride this.sorting bir array olmali
    const sortList: any = {};
    if (this.sorting !== null && this.sorting.status) {
      sortList[`${this.sorting.column}`] = this.sorting.descending ? 'DESC' : 'ASC';
    }
    return sortList;
  }

  convertToTableDataSet(response: any) {
    if (this.mapPath && Util.getObjectPathValue(response, this.mapPath)) {
      return Util.getObjectPathValue(response, this.mapPath);
    }
    return null;
  }

  onLoadSuccessHandler(response: any) {
    let mapPath = this.convertToTableDataSet(response);
    if (mapPath) {
      if (this.hasPaging && this.serverSide) {
        this.rows = mapPath.data ? mapPath.data : [];
      } else {
        this.rows = mapPath ? mapPath : [];
      }
    } else if (response.data && Util.type(response.data) === 'Object' && !this.mapPath) {
      this.rows = response.data.map(this.events.success);
      mapPath = response;
    } else {
      this.reset();
    }
    if (this.hasPaging && this.serverSide) {
      if (mapPath) {
        if (typeof mapPath.totalCount !== 'undefined') {
          this.paging.totalCount = mapPath.totalCount;
        }
        if (typeof mapPath.totalPages !== 'undefined') {
          this.paging.totalPages = mapPath.totalPages;
        }
      }
    }
    if (this.rows.length <= 0) {
      this.rendered(null);
    }
    this.getNewExcelOptions();
  }

  onLoadErrorHandler(error: ErrorResponse<any>): void {
    if (this.events.error) {
      this.events.error(error);
    }
    if (this.rows.length <= 0) {
      this.rendered(null);
    }
  }

  onPageChangeHandler(page: Pager) {
    if (page.currentPage) {
      this.paging.pageNumber = page.currentPage - 1;
    }
    this.load();
  }

  check(row: any) {
    return !!this.list.find((item) => Util.isContained(row, item));
  }

  click(row: any, $event: MouseEvent) {
    clearTimeout(this.clickDelay);
    this.clickDelay = window.setTimeout(() => {
      if ($event.detail === 1) {
        if (this.multiselect) {
          const index = this.list.indexOf(row);
          if (index < 0) {
            this._selected = row;
            this.list.push(row);
          } else {
            this._selected = null;
            this.list.splice(index, 1);
          }
        } else {
          this.list = [];
          if (this._selected === row) {
            this._selected = null;
          } else {
            this._selected = row;
            this.list.push(row);
          }
        }
        if (this.events.click) {
          this.events.click(row, $event);
        }
      }
    }, 260);
  }

  dblclick(row: any, $event: MouseEvent) {
    window.clearTimeout(this.clickDelay);
    if (this.events.dblclick) {
      this.events.dblclick(row, $event);
    }
  }

  add() {
    this.rows = Util.union(this.rows, this.reference.list);
    this.reference.list.forEach(value => {
      this.reference.rows.splice(this.reference.rows.indexOf(value), 1);
    });
    this.list = this.reference.list;
    this.reference.list = [];
    if (this.events.drag && this.events.drag.complete) {
      this.events.drag.complete(this);
      this.dragReset();
    }
  }

  remove() {
    this.list.forEach((value) => {
      this.rows.splice(this.rows.indexOf(value), 1);
    });
    this.reference.rows = Util.union(this.reference.rows, this.list);
    this.reference.list = this.list;
    this.list = [];
    if (this.reference.events.drag && this.reference.events.drag.complete) {
      this.reference.events.drag.complete(this.reference);
      this.dragReset();
    }
  }

  dragOver($event: Event) {
    $event.preventDefault();
  }

  dragStart($event: DragEvent, row: any) {
    this.drag.start = true;
    if (this.list.indexOf(row) < 0) {
      this.click(row, $event);
    }
    const element = <Element>$event.target;
    const found = element.querySelectorAll('object');
    if (found.length > 0) {
      found[0].remove();
    }
    $event.dataTransfer.effectAllowed = 'copy';
    $event.dataTransfer.setDragImage(element, 0, 0);
    $event.dataTransfer.setData('text', JSON.stringify(this.list));
  }

  drop($event: DragEvent) {
    $event.preventDefault();
    if (!this.drag.start) {
      const list = JSON.parse($event.dataTransfer.getData('text'));
      this.rows = [...this.rows, ...list];
      this.reference.dragCompleted();
      this.list = [...this.list, ...list];
      if (this.events.drag && this.events.drag.complete) {
        this.events.drag.complete(this);
      }
    }
  }

  dragCompleted() {
    this.list.map((item) => {
      const index = this.rows.indexOf(item);
      this.rows.splice(index, 1);
      this.list.splice(this.list.indexOf(item), 1);
    });
    this.dragReset();
    this.drag.start = false;
  }

  dragReset() {
    this.reference._selected = null;
    this._selected = null;
    this.reference.list = [];
    this.list = [];
  }

  changeActionStatus(status: any | boolean[] | boolean) {
    if (status !== null && status.getType() === 'Array') {
      for (const key in this.actions) {
        if (this.actions.hasOwnProperty(key)) {
          this.actions[key].disable = status[key];
        }
      }
    } else if (status !== null && status.getType() === 'Boolean') {
      for (const item of this.actions) {
        item.disable = status;
      }
    }
  }

  reset() {
    this.paging = {
      pageSize: this.paging.pageSize,
      pageNumber: 0,
      totalCount: 0,
      totalPages: 0
    };
    this.rows = [];
  }
}
