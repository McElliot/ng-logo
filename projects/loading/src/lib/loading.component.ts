import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {

  public status = true;

  constructor(private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingService.watch.subscribe((value: boolean) => this.handleLoading(value));
  }

  ngOnDestroy() {
    this.loadingService.watch.unsubscribe();
  }

  handleLoading(value: boolean) {
    this.status = (this.loadingService.count.length <= 0);
  }
}
