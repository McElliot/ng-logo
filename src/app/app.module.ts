import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LanguageInitSetting, LanguageModule} from '@logo/language';
import {CoreModule} from '../../projects/logo/core/src/lib/core.module';
import {STORAGE_TYPES} from '../../projects/logo/core/src/shared/services/storage/storage.service';

const languageConf: LanguageInitSetting = {abbr: 'en', readFromFile: false, extension: 'json'};
const EXTERNAL_MODULES = [
  LanguageModule.forRoot(languageConf),
  CoreModule.forRoot(STORAGE_TYPES.SESSION)
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, EXTERNAL_MODULES],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
