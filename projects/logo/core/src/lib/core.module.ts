import {ModuleWithProviders, NgModule} from '@angular/core';
import {IsActiveRouteDirective} from '../shared/directives/is-active-route.directive';
import {LastDirective} from '../shared/directives/last.directive';
import {HTMLParserDirective} from '../shared/directives/parser.directive';
import {VariableDirective} from '../shared/directives/variable.directive';
import {VideoSnapshotDirective} from '../shared/directives/video-snapshot.directive';
import {EndpointService} from '../shared/services/endpoint/endpoint.service';
import {LoggerService} from '../shared/services/logger/logger.service';
import {StateService} from '../shared/services/state/state.service';
import {WatcherService} from '../shared/services/watcher/watcher.service';
import {FormatPipe} from '../shared/pipe/format.pipe';
import {OrderPipe} from '../shared/pipe/order.pipe';
import {STORAGE_TYPE_CONFIG, STORAGE_TYPES, StorageFactory, StorageService} from '../shared/services/storage/storage.service';

const DIRECTIVES = [IsActiveRouteDirective, LastDirective, HTMLParserDirective, VariableDirective, VideoSnapshotDirective];
const SERVICES = [EndpointService, LoggerService, StateService, WatcherService];
const PIPES = [FormatPipe, OrderPipe];

export let StorageClass = null;

@NgModule({
  declarations: [DIRECTIVES, PIPES],
  imports: [],
  providers: [],
  exports: [DIRECTIVES, PIPES]
})
export class CoreModule {
  constructor(private storageService: StorageService) {
    StorageClass = this.storageService;
  }

  static forRoot(storagetypes?: STORAGE_TYPES): ModuleWithProviders {
    if (!storagetypes) {
      storagetypes = STORAGE_TYPES.LOCAL;
    }
    return {
      ngModule: CoreModule,
      providers: [
        SERVICES,
        {provide: STORAGE_TYPE_CONFIG, useValue: storagetypes},
        {provide: StorageService, useFactory: StorageFactory, deps: [STORAGE_TYPE_CONFIG]}
      ]
    };
  }
}

// const injector = Injector.create({
//   providers: [
//     {provide: STORAGE_TYPE_CONFIG, useValue: STORAGE_TYPES.SESSION},
//     {provide: StorageService, deps: [STORAGE_TYPE_CONFIG]}
//   ],
// });
// export const StorageClass: StorageService = injector.get(StorageService);
// console.log(StorageClass);
