import { distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export abstract class Store<T> extends BehaviorSubject<T> {
  constructor(initialState: T) {
    super(initialState);
  }

  public dispatch(fn: (state: T) => T) {
    this.next(fn(this.getValue()));
  }

  public select<R>(fn: (state: T) => R) {
    return this.pipe(map<T, R>(fn), distinctUntilChanged());
  }

  public selectSync<R>(fn: (state: T) => R) {
    return fn(this.getValue());
  }
}
