import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';

declare const grecaptcha: any;

declare global {
  interface Window {
    grecaptcha: any;
    reCaptchaLoad: () => void;
  }
}

export const CAPTCHA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CaptchaComponent),
  multi: true,
};

/**
 * Output expire {boolean} - calls when recaptcha was expired
 * Output done{string} - send token to parent module methods
 */
@Component({
  selector: 'capthca',
  template: `
    <div #captchaRef attr.data-sitekey="{{captcha.key}}" class="g-recaptcha"></div>`,
  styleUrls: ['./captcha.component.scss'],
  providers: [CAPTCHA_VALUE_ACCESSOR]
})
export class CaptchaComponent implements ControlValueAccessor, OnInit {
  @ViewChild('captchaRef') captchaRef: ElementRef;
  @Input() key: string;
  @Output() done: EventEmitter<string> = new EventEmitter();
  @Output() expire: EventEmitter<string> = new EventEmitter();
  public captcha;
  public script: HTMLScriptElement = <HTMLScriptElement>document.createElement('script');
  public url;
  public config;
  private onChange: (value: string) => void;
  private onTouched: (value: string) => void;

  constructor(private ngZone: NgZone) {
  }

  private _lang = 'en-EN';

  get lang() {
    return this._lang;
  }

  @Input() set lang(lang: string) {
    this._lang = lang;
  }

  ngOnInit() {
    this.url = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit`;
    this.captcha = {
      widgetId: 10,
      token: undefined,
      key: this.key,
      onSuccess: (token: string) => {
        // console.log('Captcha register code is: ', token);
        this.captcha.token = token;
        this.done.emit(token);
        this.ngZone.run(() => {
          this.onChange(token);
          this.onTouched(token);
        });
      },
      onExpired: (expire) => {
        // console.log('Captcha was expired: ', expire);
        this.ngZone.run(() => {
          this.onChange(null);
          this.onTouched(null);
        });
      },
      addScript: () => {
        this.script.src = this.url;
        this.script.id = 'captcha_script';
        this.script.async = true;
        this.script.defer = true;
        document.body.appendChild(this.script);
        this.captcha.addImage();
      },
      addImage: () => {
        // console.log('reCaptcha active');
        this.config = {
          'sitekey': this.captcha.key,
          'callback': this.captcha.onSuccess.bind(this),
          'expired-callback': this.captcha.onExpired.bind(this),
          'size': 'normal',
          'theme': 'light',
          'hl': this.lang
        };
        window.reCaptchaLoad = () => {
          this.captcha.widgetId = this.captcha.render(this.captchaRef.nativeElement, this.config);
        };
      },
      render: (element: HTMLElement, config): number => {
        return grecaptcha.render(element, config);
      }
    };
    this.captcha.addScript();
  }

  reset() {
    grecaptcha.reset();
    this.captcha.onExpired(null);
    this.captcha.token = null;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
