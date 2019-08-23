import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagingComponent} from './paging.component';
import {LanguageModule} from '@logo/language';

@NgModule({
  declarations: [PagingComponent],
  imports: [CommonModule, LanguageModule],
  exports: [PagingComponent]
})
export class PagingModule {
}
