import {Component} from '@angular/core';
import {LanguageService} from '@logo/language';
import {RouterLinkActive} from '@angular/router';
import {StateService, StorageClass} from '@logo/core';

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

  constructor(private languageService: LanguageService, private ss: StateService) {
    this.setState();
    this.setStorage();
  }

  setState() {
    this.ss.set('titleFromState', 'titleFromState is set here');
    this.titleFromState = this.ss.get('titleFromState');
  }

  setStorage() {
    StorageClass.setItem('titleFromStorage', 'titleFromStorage is set here');
    this.titleFromStorage = StorageClass.getItem('titleFromStorage');
  }

  isActiveRoute($event) {
    this.route = $event;
    console.log('active-route');
  }
}
