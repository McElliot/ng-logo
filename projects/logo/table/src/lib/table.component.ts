// AAAA,

import {Component, ContentChild, Input, OnInit, Renderer2, TemplateRef} from '@angular/core';
import {Events} from './types/event.model';
import {ExcelComponent, ExcelSettingType, ExcelTableColumn} from '@logo/excel';
import {Paging} from '@logo/paging';
import {EndpointService, WatcherService} from '@logo/core';
import {LanguageService} from '@logo/language';


export type VariableResolver = (row: any, column?: TableColumn) => string;
export type VariableHandler = (data: any) => any;
export type TemplateHandler = (row: any, template: any, index ?: number) => any;

/**
 * The Table Meta class is used for type definition.
 */
export class TableMeta<T> {
  service: { url: string, method: string };
  columns: TableColumn[];
  events?: Events<T>;
  actions?: { [key: string]: TableAction };
  mapPath?: string | null;
}

/**
 * @Input template usage
 * This input for create extra content for table head and body.
 * Difference of the columns input is content property, This property accepts string or any variable
 * 4 options are required;
 * "template.display" props needs for thead.
 * "template variable" is used for filtering. if set to null inside the thead will be showed disabled inputbox.
 * "template.content"  is need for html content. This function this function gets 2 parameters, first one
 * return current row data, second is index of current row index.
 * "template.className" is need for set style class name
 *
 * Usage example:
 * this.table.templates = [ { display: 'driver', variable: 'courier.courierFullName', content: this.selected.fullname} ];
 *
 * as function usage:
 * this.templates=[{
 *  display: 'count',
 *  variable: null,
 *  content: (row, template, index) => row.deliveries ? row.deliveries.length : 0,
 *  className: 'count'
 * }]
 */
export class TableTemplate {
  public display = '';
  public variable = '';
  public content: TemplateHandler | null = null;
  public className = null;
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
 * @Input column usage
 * TableColumn class used for define table header properties
 *
 * @property {String} [display=''] - Visible text, this text will be translate by language file array
 * @property {String | function} [variable=''] - this prop used for set Rest Service return json prop path.
 * This property can also be assigned as a function. If use as a function, it must return object path again.
 * For example: Rest service return {person: {name: 'serkan', surname: 'konakcı'}} and you want to display surname on this column
 * you must to set the variable field value to 'person.surname' Sample: column.variable = 'person.surnaname'
 * @property {String} [filter=''] - format of the Pipe types {text | date | percentage | decimal | datetime | number }
 * @property {boolean} [filterDisable=false] if it is true filter of the thead will be disabled input textbox
 * @property {function} [classFunction] method used for return class name
 * @property {function} [variableFunction] method used for change data before return
 * For example
 */
export class TableColumn {
  display = '';
  variable: VariableResolver | string = '';
  variableFunction?: VariableHandler | null = null;
  filter?: string | 'text' | 'percentage ' | 'decimal' | 'datetime' | 'number' | 'date' | null = 'text';
  filterDisable ? = false;
  hidden ? = true;
  className ? = '';
  classFunction ?: VariableResolver | null = null;
  sortable ? = false;
  sortingKey?: string | null = null;
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
 * @property {WatchService} [loaded = new WatchService()] - when table load completed this method can be call.
 * WatchService get tree function this.loaded.success, this.loaded.error and this.loaded.completed
 *
 * @property {Boolean} refButtonStatus - This property hide or show reference buttons (+ and - buttons)
 */
@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() public reference: TableComponent;
  @Input() public refButtonStatus = true;
  @Input() public mapPath: string | null = null;
  @Input() public automatic = true;
  @Input() public multiselect = false;
  @Input() public templates: TableTemplate[] = [];
  @Input() public theads: TableHead[] = [];
  @Input() public refresh = false;
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
  public sorting: { column: string | VariableResolver, descending: boolean, status: boolean } = {
    column: 'updatedOn',
    descending: true,
    status: this.sort
  };
  public filter ? = {};
  public body: any = {};
  public interval: { status: boolean, time: number } = {status: false, time: 30000};
  public timeout: number;
  public drag: { start: boolean, list: any[] } = {start: false, list: []};
  private exporter: ExcelComponent;
  private filterDebounce = new WatcherService();

  constructor(private api: EndpointService,
              private language: LanguageService,
              // TODO private loadingService: LoadingService,
              public renderer: Renderer2) {
    // TODO this.exporter = new ExcelGetter(this.api);
  }

  @Input() private _columns: TableColumn[] = [];

  get columns(): TableColumn[] {
    return this._columns;
  }

  set columns(value: TableColumn[]) {
    this._columns = value;
    // TODO this.excel.columns = value;
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
    this.sorting.status = this.sort;
    this.service.method = this.service.method || 'GET';
    // TODO debounce time could be set outside of the component
    // TODO this.filterDebounce.debounce(1000).subscribe((value) => this.setFilter(value));
    this._columns = this._columns.map((item: TableColumn) => {
      item.filter = item.filter ? item.filter : 'text';
      return item;
    });
    // TODO: if (this.automatic && !this.reference) {
    if (this.automatic) {
      // TODO this.load();
    }
    if (this.interval.status) {
      console.log('########################### Remove This');
      // TODO this.reload();
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
}
