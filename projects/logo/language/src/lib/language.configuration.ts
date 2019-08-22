/*
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {Language, LanguageInitSetting} from './language';

export function LanguageConfigurationFactory(initSetting: LanguageInitSetting) {
  const languageConfiguration = new LanguageConfiguration();
  languageConfiguration.setDefault(initSetting.abbr || 'en');
  languageConfiguration.setPath(initSetting.path ? initSetting.path : '/assets/languages');
  languageConfiguration.setReadFromFile(initSetting.readFromFile);
  if (!!initSetting.extension) {
    languageConfiguration.setExtension(initSetting.extension);
  }
  return languageConfiguration;
}

/**
 * Creates LanguageConfiguration object which used at LanguageService
 * This class added to LanguageModule and it accept config file as a provider
 * You can set configuration from your app.module.ts
 *
 * Example:
 * or const MODULES = [LanguageModule.forRoot({abbr: 'tr'})];
 * or const MODULES = [LanguageModule.forRoot({abbr: 'tr', readFromFile: false'})];
 * or const MODULES = [LanguageModule.forRoot({abbr: 'tr', readFromFile: false, path: '/assets/languages'})];
 * or const MODULES = [LanguageModule.forRoot({abbr: 'tr', readFromFile: true'})];
 *
 * @NgModule({
 *  declarations: [AppComponent],
 *  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, MODULES],
 *  providers: [],
 *  bootstrap: [AppComponent]
 * })
 * export class AppModule {
}

 */
export class LanguageConfiguration {
  public list: Language[] = [
    {abbr: 'en', code: 'en-EN', display: 'English'},
    {abbr: 'tr', code: 'tr-TR', display: 'Türkçe'},
  ];
  public default = this.list[0];
  public assetsPath = '/assets/languages';
  public extension = 'json';
  public readFromFile = false;

  findLanguage(value: string) {
    return this.list.find(language => language.abbr === value || language.code === value) || null;
  }

  setReadFromFile(value: boolean) {
    this.readFromFile = !!value;
  }

  setDefault(value: string) {
    this.default = this.findLanguage(value) || this.list[0];
  }

  setPath(path: string) {
    this.assetsPath = path;
  }

  setExtension(extension: string) {
    this.extension = extension;
  }

  addLanguage(language: Language) {
    if (!this.findLanguage(language.code)) {
      this.list.push(language);
    }
  }
}
