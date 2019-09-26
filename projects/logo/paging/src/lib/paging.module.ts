import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LanguageModule} from '@logo-software/language';
import {PagingComponent} from './paging.component';

@NgModule({
  declarations: [PagingComponent],
  imports: [CommonModule, LanguageModule],
  exports: [PagingComponent]
})
export class PagingModule {
}
