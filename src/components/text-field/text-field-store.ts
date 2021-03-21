import { Store } from '../../store/store';

export interface State {
  isForcus: boolean | null;
  value: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
}

export class TextFieldStore extends Store<State> {
  constructor() {
    super({
      isForcus: null,
      value: '',
      required: false,
      disabled: false,
      readonly: false,
    });
  }

  get isForcus$() {
    return this.select(state => state.isForcus);
  }
  setIsForcus(isForcus: boolean) {
    this.dispatch(state => ({
      ...state,
      isForcus,
    }));
  }
  // get isForcus() {
  //   return this.selectSync(state => state.isForcus);
  // }

  get value$() {
    return this.select(state => state.value);
  }
  setValue(value: string) {
    this.dispatch(state => ({
      ...state,
      value,
    }));
  }

  get required$() {
    return this.select(state => state.required);
  }
  setRequired(required: boolean) {
    this.dispatch(state => ({
      ...state,
      required,
    }));
  }

  get disabled$() {
    return this.select(state => state.disabled);
  }
  setDisabled(disabled: boolean) {
    this.dispatch(state => ({
      ...state,
      disabled,
    }));
  }

  get readonly$() {
    return this.select(state => state.readonly);
  }
  get readonly() {
    return this.selectSync(state => state.readonly);
  }
  setReadonly(readonly: boolean) {
    this.dispatch(state => ({
      ...state,
      readonly,
    }));
  }
}
