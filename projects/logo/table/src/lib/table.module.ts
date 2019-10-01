/**
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '@logo-software/core';
import {LanguageModule} from '@logo-software/language';
import {ExcelModule} from '@logo-software/excel';
import {PagingModule} from '@logo-software/paging';
import {TableComponent} from './table.component';


@NgModule({
  imports: [CommonModule, PagingModule, HttpClientModule, LanguageModule, CoreModule, ExcelModule],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class TableModule {
}
