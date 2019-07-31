/*
 * Copyright  Bolt Insight Limited. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of Bolt Insight Limited.
 * Any reproduction of this material must contain this notice.
 */

import {AfterContentInit, Directive, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NavigationEnd, Router, RouterLinkActive} from '@angular/router';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[appIsActiveRoute]'
})
export class IsActiveRouteDirective implements AfterContentInit, OnDestroy {
  @Input() appIsActiveRoute: RouterLinkActive;
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
      if (this.appIsActiveRoute.isActive) {
        this.isActiveEmitter.emit(this.appIsActiveRoute);
      }
    });
  }
}
