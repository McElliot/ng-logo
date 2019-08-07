import {AfterContentInit, Directive, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NavigationEnd, Router, RouterLinkActive} from '@angular/router';
import {Subscription} from 'rxjs';

/**
 * Usage example:
 * <a
 *    [routerLink]="['home']"
 *    routerLinkActive="accordion-active"
 *    #reference="routerLinkActive"
 *    [isActiveRoute]="reference"
 *    (isActiveEmitter)="isActiveRoute($event)"
 *  >
 *  Link to Home
 *  </a> - this link is {{route && route.isActive ? 'active' : 'not active'}}
 */
@Directive({
  selector: '[isActiveRoute]'
})
export class IsActiveRouteDirective implements AfterContentInit, OnDestroy {
  @Input() isActiveRoute: RouterLinkActive;
  @Output() isActiveEmitter: EventEmitter<RouterLinkActive> = new EventEmitter<RouterLinkActive>();
  private subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.update();
      }
    });
  }

  ngAfterContentInit(): void {
    this.update();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private update(): void {
    Promise.resolve().then(() => {
      if (this.isActiveRoute.isActive) {
        this.isActiveEmitter.emit(this.isActiveRoute);
      }
    });
  }
}
