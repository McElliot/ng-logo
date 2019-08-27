/**
 * @license
 * Copyright Logo Yazılım. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of Logo Yazılım.
 * Any reproduction of this material must contain this notice.
 */

import {NgModule} from '@angular/core';
import {TableComponent} from './table.component';

import {PagingModule} from '@logo/paging';

@NgModule({
  declarations: [TableComponent],
  imports: [PagingModule],
  exports: [TableComponent]
})
export class TableModule {
}
