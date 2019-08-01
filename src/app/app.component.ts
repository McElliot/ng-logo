import {Component} from '@angular/core';
import {LanguageService} from '../../projects/srknc/language/src/lib/language.service';

@Component({
  selector: 'lbs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'logo-ng-library';

  constructor(private languageService: LanguageService) {
  }

  setLanguage(lang: string = 'tr') {
    this.languageService.setLanguage(lang);
  }
}
