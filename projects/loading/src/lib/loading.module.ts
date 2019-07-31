import {NgModule} from '@angular/core';
import {LoadingComponent} from './loading.component';
import {LoadingService} from './loading.service';

@NgModule({
  declarations: [LoadingComponent],
  imports: [],
  exports: [LoadingComponent],
  providers: [LoadingService]
})
export class LoadingModule {
}
