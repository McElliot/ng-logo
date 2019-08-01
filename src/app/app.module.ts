import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LanguageModule} from '../../projects/srknc/language/src/lib/language.module';


const languageModule = LanguageModule.forRoot({abbr: 'en', readFromFile: true});

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, languageModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
