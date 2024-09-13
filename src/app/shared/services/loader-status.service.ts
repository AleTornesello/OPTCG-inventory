import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderStatusService {
  public notify: Subject<boolean>;

  private _runningRequests: number;

  constructor() {
    this.notify = new Subject<boolean>();
    this._runningRequests = 0;
  }

  show() {
    if (this._runningRequests >= 0) {
      this.notify.next(true);
    }
    this._runningRequests++;
  }

  hide() {
    if (this._runningRequests > 0) this._runningRequests--;
    if (this._runningRequests <= 0) {
      this.notify.next(false);
    }
  }

  // onNotify(event: boolean) {
  //   this.notify.next(event);
  // }
}
