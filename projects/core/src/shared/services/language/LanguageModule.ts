import {NgModule} from '@angular/core';
import {LanguagePipe} from '~/shared/services/language/language.pipe';
import {LanguageService} from '~/shared/services/language/language.service';


@NgModule({
  declarations: [LanguagePipe],
  imports: [],
  providers: [LanguageService]
})
export class AppModule {
}
