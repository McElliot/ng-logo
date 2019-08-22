import {ChangeDetectorRef, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';


/**
 * base64 string converter
 * if base64 string was given, it will automatically emit decoded string otherwise it will emit encoded string
 * Usage example:
 * <span [(b64)]="base64String">{{base64String}}</span>
 */
@Directive({selector: '[b64]'})
export class Base64Directive implements OnInit {
  @Input() b64: string | null = null;
  @Output() b64Change: EventEmitter<string> = new EventEmitter<string>();

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const text = (this.b64 && !this.isBase64(this.b64)) ? this.encode(this.b64) : this.decode(this.b64);
    this.b64Change.emit(text);
    this.cd.detectChanges();
  }

  isBase64(value: string) {
    const regexp = new RegExp(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/);
    return regexp.test(value);
  }

  encode(value: string) {
    return btoa(value);
  }

  decode(value: string) {
    return atob(value);
  }
}
