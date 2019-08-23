import {Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

/**
 * Given parameters outside of the component
 */
export interface Paging {
  status?: boolean | null;
  pageSize: number | null;
  pageNumber: number | null;
  totalCount: number | undefined;
  totalPages: number | undefined;
}

export interface Pager {
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  startPage?: number;
  endPage?: number;
  startIndex?: number;
  endIndex?: number;
  pages?: number[];
}

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnChanges {
  @Input() totalCount: number;
  @Input() pageSize = 10;
  @Input() totalPages: number;
  @HostBinding('class.app-paging') classes = true;
  @Output() paging = new EventEmitter();
  public pager: Pager = {};

  ngOnChanges(changes: SimpleChanges) {
    this.pager = this.getPager(this.totalCount, 1, this.pageSize);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.pager = this.getPager(this.totalCount, page, this.pageSize);
    this.paging.emit(this.pager);
  }

  getPager(totalItems: number, currentPage = 1, pageSize = 10) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    const threshold = 10;

    let startPage: number, endPage: number;
    if (totalPages <= threshold) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = threshold;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = this.range(startPage, endPage + 1 - startPage);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  range(start = 0, count = 0): Array<number> {
    return [...Array(count)].map((u, i) => start + i);
  }
}
