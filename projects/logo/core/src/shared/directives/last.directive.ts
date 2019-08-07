/*
 * Copyright  HepsiExpress Limited. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of HepsiExpress Limited.
 * Any reproduction of this material must contain this notice.
 */

import {Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Directive({selector: '[isLast]'})
export class LastDirective implements OnInit {
  @Input() isLast: boolean;
  @Output() isLastEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    if (this.isLast) {
      this.isLastEmitter.emit(true);
    }
  }
}
