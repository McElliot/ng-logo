import {Component} from '@angular/core';
import {LanguageService} from '@logo-software/language';
import {RouterLinkActive} from '@angular/router';
import {StateService, StorageClass} from '@logo-software/core';
import {Title} from '@angular/platform-browser';
import {ExcelSettingType} from '@logo-software/excel';
import {Paging} from '@logo-software/paging';
import {TableComponent, TableMeta} from '@logo-software/table';

@Component({
  selector: 'lbs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  titleFromStorage = 'logo-ng-library';
  titleFromState = 'logo-ng-library';
  route: RouterLinkActive;
  base64String = 'c2Vya2Fu'; // Base64 Directive
  inputValue; // Mask Directive
  excelSample: ExcelSettingType = {  // Excel Module
    name: 'ExcelFile',
    header: ['CODE', 'ADDRESS', 'NAME', 'SURNAME'],
    complete: this.excelComplete,
    columns: [
      {
        display: 'ID',
        variablePath: 'id',
        hidden: true
      },
      {
        display: 'Code',
        variablePath: 'code',
      },
      {
        display: 'Address',
        variablePath: 'recipient.address',
      },
      {
        display: 'Name',
        variablePath: 'user.name',
      },
      {
        display: 'Surname',
        variablePath: 'user.surname',
      }
    ],
    data: [
      {id: 1, code: 123213, recipient: {address: 'Doğruluk sok. 8/10 Ankara'}, user: {name: 'Serkan', surname: 'Konakcı'}},
      {id: 2, code: 2134, recipient: {address: 'Ateş sok. 3/5 İstanbul'}, user: {name: 'Seda', surname: 'Sayan'}},
      {id: 3, code: 456456, recipient: {address: 'Kıvılcım apt. 5/23 Konya'}, user: {name: 'Banu', surname: 'Alkan'}},
    ]
  };
  pagingModule = {onPageChangeHandler: ($event) => console.log('Event: ', $event)}; // Paging Module
  tableDummyData: TableMeta<any> = { // Table Module
    status: true,
    list: [],
    columns: [
      {
        display: 'ID',
        variablePath: 'id',
        filter: 'text',
        hidden: false
      },
      {
        display: 'zones',
        variablePath: 'zone.name',
        filter: 'text',
        sortable: true
      },
      {
        display: 'plate_number',
        variablePath: 'count',
        filter: 'text',
        sortable: true
      },
      {
        display: 'test',
        variablePath: 'surname',
        filter: 'text'
      },
      {
        display: 'neden',
        variablePath: 'because',
        filter: 'text'
      },
      {
        display: 'total',
        variableFunction: (row: any) => row.count === 34 ? row.count + ' added text adsasd asdasdasd asdsad ' : 0,
        className: 'total',
        sortable: true,
        sortingKey: 'zone.name'
      }
    ],
    heads: [
      {
        display: 'custom',
        className: 'total'
      }
    ],
    rows: [
      {id: '1', zone: {name: 'Çorum'}, count: 19, surname: 'konakcı', because: 'room with'},
      {id: '2', zone: {name: 'Adana'}, count: 6, surname: '', because: 'room with'},
      {id: '3', zone: {name: 'İstanbul'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', zone: {name: 'Samsun'}, count: 55, surname: 'deneme', because: 'room with'},
      {id: '1', zone: {name: 'Çorum'}, count: 19, surname: 'deneme', because: 'room with'},
      {id: '2', zone: {name: 'Ceyhan'}, count: 6, surname: 'deneme', because: 'room with'},
      {id: '3', zone: {name: 'Şile'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', zone: {name: 'Konya'}, count: 55, surname: 'deneme', because: 'room with'},
      {id: '1', zone: {name: 'Diyarbakır'}, count: 19, surname: 'deneme', because: 'room with'},
      {id: '2', zone: {name: 'Malatya'}, count: 6, surname: 'deneme', because: 'room with'},
      {id: '3', zone: {name: 'Kastamonu'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', zone: {name: 'Bitlis'}, count: 55, surname: 'deneme', because: 'room with'},
      {id: '1', zone: {name: 'Polatlı'}, count: 19, surname: 'deneme', because: 'room with'},
      {id: '2', zone: {name: 'Van'}, count: 6, surname: 'deneme', because: 'room with'},
      {id: '3', zone: {name: 'Bartın'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', zone: {name: 'Kadıköy'}, count: 55, surname: 'deneme', because: 'room with'}
    ],
    events: {
      success: (response) => console.log(response, '===> success'),
      click: (row: any) => console.log('clicked', row),
      dblclick: (row: any) => console.log('dblclick: ', row),
      drag: {start: () => console.log('dragged started'), complete: () => console.log('dragged completed')},
      params: (parameters: { filter: { [key: string]: any }, paging: Paging, sorting: { [key: string]: any } }) => {
        return parameters;
      },
    },
    actions: [
      {display: 'new', click: (table: TableComponent) => this.tableSampleAction('New', table), className: 'primary', disable: false},
      {display: 'edit', click: (table: TableComponent) => this.tableSampleAction('Edit', table), className: 'primary', disable: false},
    ],
    excel: {
      status: true,
      complete: (data) => {
        console.log('trigger excel');
        console.log('excel, table: ', data);
      }
    }
  };

  constructor(private titleService: Title, private languageService: LanguageService, private stateService: StateService) {
    this.addLanguage();
    this.setState();
    this.setStorage();
  }

  setLanguage(lang: string = 'tr') {
    this.languageService.setLanguage(lang);
  }

  addLanguage() {
    this.languageService.addLanguage({abbr: 'ro', code: 'ro-RO', display: 'Romain'});
  }

  setState() {
    this.stateService.set('titleFromState', 'titleFromState is set here');
    this.titleFromState = this.stateService.get('titleFromState');
    this.titleService.setTitle(this.titleFromState);
  }

  setStorage() {
    StorageClass.setItem('titleFromStorage', 'titleFromStorage is set here');
    this.titleFromStorage = StorageClass.getItem('titleFromStorage');
    this.titleService.setTitle(this.titleFromStorage);
  }

  isActiveRoute($event) {
    this.route = $event;
    console.log('active-route');
  }

  excelComplete() {
    console.log('excel export completed');
  }

  tableSampleAction(action: string, table: TableComponent) {
    console.log(action, 'action triggered', table);
  }
}
