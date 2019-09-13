import {Component} from '@angular/core';
import {LanguageService} from '@logo/language';
import {RouterLinkActive} from '@angular/router';
import {StateService, StorageClass} from '@logo/core';
import {Title} from '@angular/platform-browser';
import {TableMeta} from '@logo/table';

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
  excelSample = {
    fileName: 'ExcelFile',
    header: ['CODE', 'ADDRESS', 'NAME', 'SURNAME'],
    complete: this.excelComplete,
    column: [
      {
        display: 'ID',
        variable: 'id',
        hidden: true
      },
      {
        display: 'Code',
        variable: 'code',
      },
      {
        display: 'Address',
        variable: 'recipient.address',
      },
      {
        display: 'Name',
        variable: 'user.name',
      },
      {
        display: 'Surname',
        variable: 'user.surname',
      }
    ],
    data: [
      {id: 1, code: 123213, recipient: {address: 'Doğruluk sok. 8/10 Ankara'}, user: {name: 'Serkan', surname: 'Konakcı'}},
      {id: 2, code: 2134, recipient: {address: 'Ateş sok. 3/5 İstanbul'}, user: {name: 'Seda', surname: 'Sayan'}},
      {id: 3, code: 456456, recipient: {address: 'Kıvılcım apt. 5/23 Konya'}, user: {name: 'Banu', surname: 'Alkan'}},
    ]
  }; // Excel Module
  pagingModule = {onPageChangeHandler: ($event) => console.log('Event: ', $event)}; // Paging Module
  tableDummyData: TableMeta<any> = {
    status: true,
    list: [],
    columns: [
      {
        display: 'ID',
        variablePath: 'id',
        filter: 'text',
        hidden: true
      },
      {
        display: 'zones',
        variablePath: 'distributionZone.name',
        filter: 'text',
        sortable: true
      },
      {
        display: 'delivery',
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
        variableFunction: (row: any) => row.count === 34 ? row.count + ' added text ' : 0,
        className: 'total',
        sortable: true,
        sortingKey: 'distributionZone.name'
      }
    ],
    heads: [
      {
        display: 'custom',
        className: 'total'
      }
    ],
    rows: [
      {id: '1', distributionZone: {name: 'Çorum'}, count: 19, surname: 'konakcı', because: 'room with'},
      {id: '2', distributionZone: {name: 'Adana'}, count: 6, surname: '', because: 'room with'},
      {id: '3', distributionZone: {name: 'İstanbul'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', distributionZone: {name: 'Samsun'}, count: 55, surname: 'deneme', because: 'room with'},
      {id: '1', distributionZone: {name: 'Çorum'}, count: 19, surname: 'deneme', because: 'room with'},
      {id: '2', distributionZone: {name: 'Ceyhan'}, count: 6, surname: 'deneme', because: 'room with'},
      {id: '3', distributionZone: {name: 'Şile'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', distributionZone: {name: 'Konya'}, count: 55, surname: 'deneme', because: 'room with'},
      {id: '1', distributionZone: {name: 'Diyarbakır'}, count: 19, surname: 'deneme', because: 'room with'},
      {id: '2', distributionZone: {name: 'Malatya'}, count: 6, surname: 'deneme', because: 'room with'},
      {id: '3', distributionZone: {name: 'Kastamonu'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', distributionZone: {name: 'Bitlis'}, count: 55, surname: 'deneme', because: 'room with'},
      {id: '1', distributionZone: {name: 'Polatlı'}, count: 19, surname: 'deneme', because: 'room with'},
      {id: '2', distributionZone: {name: 'Van'}, count: 6, surname: 'deneme', because: 'room with'},
      {id: '3', distributionZone: {name: 'Bartın'}, count: 34, surname: 'deneme', because: 'room with'},
      {id: '4', distributionZone: {name: 'Kadıköy'}, count: 55, surname: 'deneme', because: 'room with'}
    ],
    events: {
      success: (response) => console.log(response, '===>'),
      click: (row: any) => {
        console.log('clicked');
      },
      dblclick: (row: any) => console.log('dblclick: ', row)
    },
    actions: {newButton: {display: 'new', click: () => this.openSaveModal(), className: 'primary', disable: false}}
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

  openSaveModal() {
    console.log('action');
  }
}
