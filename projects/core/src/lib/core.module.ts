import {NgModule} from '@angular/core';
import {CoreComponent} from './core.component';
import {IsActiveRouteDirective} from '~/shared/directives/is-active-route.directive';
import {LastDirective} from '~/shared/directives/last.directive';
import {HTMLParserDirective} from '~/shared/directives/parser.directive';
import {VariableDirective} from '~/shared/directives/variable.directive';
import {VideoSnapshotDirective} from '~/shared/directives/video-snapshot.directive';

const DIRECTIVES = [IsActiveRouteDirective, LastDirective, HTMLParserDirective, VariableDirective, VideoSnapshotDirective];

@NgModule({
  declarations: [CoreComponent, DIRECTIVES],
  imports: [],
  exports: [CoreComponent]
})
export class CoreModule {
}
