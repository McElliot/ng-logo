import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[snapshot]'
})
export class VideoSnapshotDirective implements AfterViewInit {
  @Input() snapshot: any;
  @Input() scale = 0.25;
  @Output() snapshotEmitter: EventEmitter<HTMLCanvasElement> = new EventEmitter<HTMLCanvasElement>();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.addEventListener('loadeddata', () => {
      this.shoot();
    }, false);
  }

  capture(video: ElementRef) {
    const canvas = document.createElement('canvas');
    canvas.width = 100; // video.nativeElement.offsetWidth;
    canvas.height = 135;  // video.nativeElement.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video.nativeElement, 0, 0, 100, 135); // video.nativeElement.offsetWidth, video.nativeElement.offsetHeight);
    return canvas;
  }

  shoot() {
    this.snapshotEmitter.emit(this.capture(this.elementRef));
    // this.renderer.appendChild(this.elementRef.nativeElement.parentElement, this.capture(this.elementRef));
  }
}
