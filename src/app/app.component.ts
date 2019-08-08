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
  inputValue; // Mask Directive

  constructor(private languageService: LanguageService, private ss: StateService) {
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
