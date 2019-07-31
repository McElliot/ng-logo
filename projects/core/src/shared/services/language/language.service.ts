import {Injectable} from '@angular/core';

import {LanguageLoader} from '~/shared/services/language/language.loader';
import {configuration} from '~/shared/configuration';
import {languages} from '~/shared/enums';
import {WatcherService} from '~/shared/services/watcher/watcher.service';

export interface Language {
  code: string;
  display: string;
  abbr: string;
}

@Injectable()
export class LanguageService {
  public file: { [key: string]: string } = {};
  public onLangChange: WatcherService = new WatcherService();
  private _language: Language = configuration.language.default;

  get language(): Language {
    return this._language;
  }

  set language(lang: Language) {
    this._language = lang;
  }

  public list = languages;

  constructor(private translateLoader: LanguageLoader) {
    this.getLanguage();
  }

  setLanguage(lang: string) {
    if (this.language.code !== lang) {
      const find = this.list.filter(item => item.code === lang);
      this.language = find.length > 0 ? find[0] : languages[0];
      this.getLanguage();
    }
  }

  getLanguage() {
    this.translateLoader.getTranslation(this.language.code).subscribe(item => {
      this.file = item;
      this.onLangChange.next();
    });
  }

  translate(key: string, params?: any) {
    let translatedString = this.file[key] || key;
    const type = params !== null && typeof params !== 'undefined' ? params.constructor.name : null;
    if (type === 'Array') {
      params.forEach((param: any, paramIndex: number) => {
        translatedString = translatedString.replace(new RegExp(`\\{${paramIndex}\\}`, 'g'), param);
      });
    } else if (type === 'Object') {
      Object.keys(params).forEach((keyName: string, index: number) => {
        translatedString = translatedString.replace(new RegExp(`\\{${keyName}\\}`, 'g'), params[keyName]);
      });
    }
    return translatedString;
  }
}
