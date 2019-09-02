/**
 * @license
 * Copyright LOGO YAZILIM SANAYİ VE TİCARET A.Ş. All Rights Reserved.
 *
 * Save to the extent permitted by law, you may not use, copy, modify,
 * distribute or create derivative works of this material or any part
 * of it without the prior written consent of LOGO YAZILIM SANAYİ VE TİCARET A.Ş. Limited.
 * Any reproduction of this material must contain this notice.
 */

import {AfterViewInit, Directive, ElementRef, Host, Input, Renderer2} from '@angular/core';
import * as resize from 'element-resize-event';
import {TableComponent} from '../table.component';

@Directive({
  selector: '[stickyDirective]'
})
export class StickyDirective implements AfterViewInit {
  @Input('stickyDirective') public sticky = false;
  @Input() public height = '300px';
  public host: HTMLElement;
  public tableContainer: HTMLElement | null;
  public table: Element;
  public th: NodeListOf<Element>;
  public td: NodeListOf<Element>;
  public filter: NodeListOf<Element>;
  public stickyHeader: Element;
  private timeout: number;
  private scrollWidth: number;

  constructor(private elRef: ElementRef, public renderer: Renderer2, @Host() private tableComponent: TableComponent) {
  }

  ngAfterViewInit() {
    if (this.sticky) {
      this.scrollWidth = this.getScrollbarWidth();
      this.host = this.elRef.nativeElement.closest('app-table');
      this.init();
      this.tableComponent.stickyInitialized = true;
    }
  }

  init() {
    this.getTableHeader();
    this.setClass();
    if (!this.tableComponent.stickyInitialized) {
      this.createStickyHeader();
    }
    this.interval();
  }

  setClass() {
    this.renderer.addClass(this.tableContainer, 'table-sticky');
    this.renderer.setStyle(this.tableContainer, 'max-height', this.height);
  }

  getTableHeader() {
    this.table = this.elRef.nativeElement.closest('table');
    this.td = this.table.querySelectorAll('tbody tr:first-child td');
    this.th = this.tableComponent.stickyInitialized ?
      this.host.querySelectorAll('.div-sticky tr:first-child th') : this.table.querySelectorAll('thead tr:first-child th');
    this.filter = this.tableComponent.stickyInitialized ?
      this.host.querySelectorAll('.div-sticky tr:first-child + tr') : this.table.querySelectorAll('thead tr:first-child + tr');
    this.tableContainer = this.table.parentElement;
    resize(this.elRef.nativeElement, () => {
      this.interval();
    });
  }

  interval() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setWidth();
    }, 100);
  }

  createStickyHeader() {
    const temp: NodeListOf<Element> = this.host.querySelectorAll('.div-sticky');
    this.stickyHeader = temp.length > 0 ? temp[0] : (<any>document.createElement('div')).addClass('div-sticky');
    this.stickyHeader.innerHTML = '';
    const table = (<any>document.createElement('table')).addClass('table');
    table.appendChild((<any>this.th[0]).parentElement);
    if (this.filter.length > 0) {
      table.appendChild(this.filter[0]);
    }
    this.stickyHeader.appendChild(table);
    this.host.prepend(this.stickyHeader);
  }

  setWidth() {
    this.td.forEach((item, index) => {
      let width = (<any>item).clientWidth; // let width = (<any>item).getBoundingClientRect().width;
      const scrollWidth = this.tableScrollCheck();
      if (index === this.td.length - 1 && scrollWidth >= 0) {
        width = width + this.scrollWidth;
      }
      width = width <= 0 ? 0 : width;
      (<any>this.th[index]).style.maxWidth = width + 'px';
      (<any>this.th[index]).style.width = width + 'px';
    });
  }

  tableScrollCheck() {
    return (this.tableContainer as any).firstElementChild.offsetHeight - (this.tableContainer as any).offsetHeight;
  }

  getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    (outer as any).parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  }


}
