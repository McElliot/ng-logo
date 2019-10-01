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
      {display: 'ID', variablePath: 'id', filterType: 'text', hidden: false},
      {display: 'zone.name', variablePath: 'zone.name', filterType: 'text', sortable: true},
      {display: 'count', variablePath: 'percentage', filterType: 'range', format: '1.1-3:"en-EN"', sortable: true},
      {display: 'date', variablePath: 'hour', filterType: 'date', format: 'yyyy.MM.dd HH:mm', sortable: true},
      {display: 'surname', variablePath: 'surname', filterType: 'custom'},
      {display: 'because', variablePath: 'because', filterType: 'number', format: '4.2-3', sortable: true},
      {
        display: 'total',
        variableFunction: (row: any) => row.percentage === 34 ? row.percentage + ' added text adsasd asdasdasd asdsad ' : 0,
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
      {id: '1', zone: {name: 'Çorum'}, percentage: 19, hour: '2019-01-13', surname: 'konakcı', because: 2132131},
      {id: '2', zone: {name: 'Adana'}, percentage: 6, hour: '2019-12-22', surname: 'meydancı', because: 1235},
      {id: '3', zone: {name: 'İstanbul'}, percentage: 34, hour: '2018-03-13', surname: 'uyar', because: 54466},
      {id: '4', zone: {name: 'Samsun'}, percentage: 55, hour: '2017-06-15', surname: 'güler', because: 65467},
      {id: '1', zone: {name: 'Çorum'}, percentage: 19, hour: '2019-12-31', surname: 'sevim', because: 9876543},
      {id: '2', zone: {name: 'Ceyhan'}, percentage: 6, hour: '2013-05-11', surname: 'çakmak', because: 4556132},
      {id: '3', zone: {name: 'Şile'}, percentage: 34, hour: '2014-06-05', surname: 'duran', because: 543567},
      {id: '4', zone: {name: 'Konya'}, percentage: 55, hour: '2019-05-23', surname: 'güleç', because: 743567},
      {id: '1', zone: {name: 'Diyarbakır'}, percentage: 19, hour: '2019-07-05', surname: 'toraman', because: 98723567},
      {id: '2', zone: {name: 'Malatya'}, percentage: 6, hour: '2019-03-15', surname: 'kandır', because: 43787654},
      {id: '3', zone: {name: 'Kastamonu'}, percentage: 34, hour: '2019-08-13', surname: 'misafir', because: 123824},
      {id: '4', zone: {name: 'Bitlis'}, percentage: 55, hour: '2019-02-03', surname: 'deneme', because: 234567},
      {id: '1', zone: {name: 'Polatlı'}, percentage: 19, hour: '2019-09-21', surname: 'deneme', because: 23589},
      {id: '2', zone: {name: 'Van'}, percentage: 6, hour: '2011-11-19', surname: 'deneme', because: 354353},
      {id: '3', zone: {name: 'Bartın'}, percentage: 34, hour: '2011-03-23', surname: 'deneme', because: 34539},
      {id: '4', zone: {name: 'Kadıköy'}, percentage: 55, hour: '2016-02-27', surname: 'deneme', because: 93922}
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
