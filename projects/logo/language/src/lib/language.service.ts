import {EventEmitter, Injectable} from '@angular/core';
import {LanguageLoader} from './language.loader';
import {Language} from './language';
import {LanguageConfiguration} from './language.configuration';
import {LanguageStoreService} from './language.store';

/**
 * @Provider
 * Usage example

 import {Component} from '@angular/core';
 import {LanguageService} from '~/shared/services/language/language.service';

 @Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  })
 export class HomePage {

    constructor(private language: LanguageService) {
      this.language.onLoadComplete.subscribe(() => {
        console.log(this.language.translate('hello_world'));
      });
    }

    change() {
      this.language.setLanguage('en');
    }
  }
 */

@Injectable()
export class LanguageService {
  public onLoadComplete: EventEmitter<Language> = new EventEmitter();

  constructor(private translateLoader: LanguageLoader, private configuration: LanguageConfiguration, public store: LanguageStoreService) {
    this.language = this.configuration.default;
    this.onLoadComplete = this.store.onLoadComplete;
  }

  private _language: Language;

  get language(): Language {
    return this._language;
  }

  set language(lang: Language) {
    this._language = lang;
  }

  setLanguage(value: string) {
    if (this.language.abbr !== value && this.language.code !== value) {
      this.configuration.setDefault(value);
      this.language = this.configuration.default;
      this.store.changeLanguage();
    }
  }

  addLanguage(language: Language) {
    this.configuration.addLanguage(language);
  }

  findLanguage(value: string): Language {
    return this.configuration.findLanguage(value);
  }

  list() {
    return this.configuration.list;
  }

  translate(key: string, params?: any) {
    let translatedString = this.store.file[key] || key;
    const type = params !== null && typeof params !== 'undefined' ? params.constructor.name : null;
    if (type === 'Array') {
      params.forEach((param: any, paramIndex: number) => {
        translatedString = translatedString.replace(new RegExp(`{${paramIndex}}`, 'g'), param);
      });
    } else if (type === 'Object') {
      Object.keys(params).forEach((keyName: string, index: number) => {
        translatedString = translatedString.replace(new RegExp(`{${keyName}}`, 'g'), params[keyName]);
      });
    }
    return translatedString;
  }

  /**
   * Returns the language code name from the browser, e.g. "de"
   */
  public getBrowserLang(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }
    let browserLang: any = window.navigator.languages ? window.navigator.languages[0] : null;
    browserLang = browserLang || window.navigator.language;
    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0];
    }
    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0];
    }
    return browserLang;
  }

  /**
   * Returns the culture language code name from the browser, e.g. "de-DE"
   */
  public getBrowserCultureLang(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }
    let browserCultureLang: any = window.navigator.languages ? window.navigator.languages[0] : null;
    browserCultureLang = browserCultureLang || window.navigator.language;
    return browserCultureLang;
  }
}
