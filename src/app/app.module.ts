import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {CoreModule, STORAGE_TYPES} from '@logo/core';
import {PagingModule} from '@logo/paging';
import {LanguageInitSetting, LanguageModule} from '@logo/language';
import {ExcelModule} from '../../projects/logo/excel/src/lib/excel.module';

const languageConf: LanguageInitSetting = {abbr: 'en', readFromFile: false, extension: 'json'};
const EXTERNAL_MODULES = [
  LanguageModule.forRoot(languageConf),
  LanguageModule.forChild(languageConf),
  CoreModule.forRoot(STORAGE_TYPES.SESSION),
  ExcelModule,
  PagingModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, EXTERNAL_MODULES],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
