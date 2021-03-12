import { Store } from '../../store/store';

export interface State {
  isForcus: boolean | null;
  value: string;
}

export class TextFieldStore extends Store<State> {
  constructor() {
    super({
      isForcus: null,
      value: '',
    });
  }

  get isForcus$() {
    return this.select(state => state.isForcus);
  }
  // get isForcus() {
  //   return this.selectSync(state => state.isForcus);
  // }
  get value$() {
    return this.select(state => state.value);
  }

  setIsForcus(isForcus: boolean) {
    this.dispatch(state => ({
      ...state,
      isForcus,
    }));
  }

  setValue(value: string) {
    this.dispatch(state => ({
      ...state,
      value,
    }));
  }
}
