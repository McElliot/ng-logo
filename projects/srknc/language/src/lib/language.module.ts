/*
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {LanguageConfiguration, LanguageConfigurationFactory} from './language.configuration';
import {LanguageHttpLoaderFactory, LanguageLoader} from './language.loader';
import {LanguagePipe} from './language.pipe';
import {LanguageInitSetting} from './language';
import {LanguageStoreService} from './language.store';
import {LanguageService} from './language.service';


const PIPES = [LanguagePipe];

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [],
  declarations: [PIPES],
  exports: [PIPES]
})
export class LanguageModule {
  static forRoot(config: LanguageInitSetting): ModuleWithProviders {
    return {
      ngModule: LanguageModule,
      providers: [
        LanguageStoreService,
        LanguageService,
        {provide: LanguageLoader, useFactory: LanguageHttpLoaderFactory, deps: [HttpClient]},
        {provide: LanguageInitSetting, useValue: config},
        {provide: LanguageConfiguration, useFactory: LanguageConfigurationFactory, deps: [LanguageInitSetting]}
      ]
    };
  }

  static forChild(config: LanguageInitSetting): ModuleWithProviders {
    return {
      ngModule: LanguageModule,
      providers: [LanguageService]
    };
  }
}
