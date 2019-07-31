import {HttpClient} from '@angular/common/http';
import {configuration} from '~/shared/configuration';
import {Observable} from 'rxjs';

export abstract class LanguageLoader {
  abstract getTranslation(lang: string): Observable<any>;
}

export function LanguageHttpLoaderFactory(http: HttpClient) {
  return new LanguageHttpLoader(http);
}

export class LanguageHttpLoader implements LanguageLoader {
  constructor(
    private http: HttpClient,
    public files: string = configuration.language.files,
    public code: string = configuration.language.default.code,
    public extension: string = configuration.language.extension) {
  }

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`${this.files}/${lang || this.code}.${this.extension}`);
  }
}
