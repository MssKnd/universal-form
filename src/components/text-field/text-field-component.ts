import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { TextFieldStore } from './text-field-store';

const PX_1 = '.0625rem';
const PX_2 = '.125rem';
const PX_4 = '.25rem';
const PX_8 = '.5rem';
const PX_12 = '.75rem';
const PX_16 = '1rem';

type ValidationCallback = (input: string) => ValidationResult

interface ValidationResult {
  isValid: boolean;
  message?: string;
  progress?: [number, number]
}

export class TextFieldElement extends HTMLElement {
  private subscription = new Subscription();
  private localStore = new TextFieldStore();
  private _validationCallback: ValidationCallback | null = null;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const label = document.createElement('label');

    const style = document.createElement('style');
    style.innerText = `
    :host {
      display: flex;
      flex-direction: column;
    }
    :host.label-align-left, :host.label-align-right] {
      flex-direction: row;
      align-items: center;
    }
    label {
      font-size: ${PX_12};
      margin: 0 ${PX_8} 0 0;
    }
    div.main {
      display: flex;
      flex-direction: column;
    }
    div.input {
      // background-color: #f3f3f3;
      padding: ${PX_8} ${PX_8} ${PX_8} ${PX_8};
      display: flex;
      flex-direction: row;
      border: solid ${PX_1} #aaa;
      border-radius: ${PX_2};
    }
    div.input:hover {
      border: solid ${PX_1} #888;
    }
    div.input.focused {
      border: solid ${PX_1} #55f;
    }
    input {
      width: 100%;
      border: none;
      font-size: ${PX_16};
    }
    input:focus {
      outline: none;
    }
    .placeholder {
      color: #aaa;
      font-size: ${PX_12};
    }
    `.replace(/\n/g,'').trim();
    const mainContainer = document.createElement('div');
    mainContainer.className = 'main';
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input';
    const leadingSlot = document.createElement('slot');
    leadingSlot.setAttribute('name', 'leading');
    const input = document.createElement('input');
    this.subscription.add(fromEvent(input, 'focus').subscribe(() => this.localStore.setIsForcus(true)));
    this.subscription.add(fromEvent(input, 'blur').subscribe(() => this.localStore.setIsForcus(false)));
    this.subscription.add(fromEvent(inputContainer, 'click').subscribe(() => input.focus()));
    this.subscription.add(fromEvent(input, 'input').pipe<string, string, string>(
      pluck('target', 'value'),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => this.localStore.setValue(value)));
    const trailingSlot = document.createElement('slot');
    trailingSlot.setAttribute('name', 'trailing');
    input.setAttribute('type', 'text');

    inputContainer.appendChild(leadingSlot);
    inputContainer.appendChild(input);
    inputContainer.appendChild(trailingSlot);
    mainContainer.appendChild(inputContainer);

    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom';

    mainContainer.appendChild(bottomContainer);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(label);
    shadowRoot.appendChild(mainContainer);

    this.subscription.add(this.localStore.isForcus$.subscribe(isFocus => {
      if (isFocus) {
        inputContainer.classList.add('focused');
      } else {
        inputContainer.classList.remove('focused');
      }
    }));
    this.subscription.add(this.localStore.value$.subscribe(value => console.log(value)));
  }

  static get observedAttributes() {
    return ['label', 'name', 'disabled', 'required', 'readonly', 'label-align', 'placeholder'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(name);
    switch (name) {
      case 'name': {
        const label = this.shadowRoot?.querySelector('label');
        label?.setAttribute('for', newValue ?? '');
        const input = this.shadowRoot?.querySelector('input');
        input?.setAttribute('id', newValue ?? '');
        break;
      }
      case 'label': {
        const label = this.shadowRoot?.querySelector('label');
        if (label) {
          label.innerText = newValue ?? '';
        }
        break;
      }
      case 'placeholder': {
        const input = this.shadowRoot?.querySelector('input');
        const bottomContainer = this.shadowRoot?.querySelector('.bottom');
        if (newValue) {
          input?.setAttribute('placeholder', newValue);
          const placeholder = document.createElement('span');
          placeholder.className = 'placeholder';
          placeholder.innerText = newValue;
          bottomContainer?.appendChild(placeholder);
        }
        break;
      }
      default:
        break;
    }
  }

  private connectedCallback() {
    console.log('connectedCallback');
  }

  private disconnectedCallback() {
    console.log('disconnectedCallback');
    this.subscription.unsubscribe();
  }

  set validationCallback(callback: ValidationCallback | null) {
    console.log('set validationCallback');
    this._validationCallback = callback;
    // if (callback) {
    // }
    // const input = this.shadowRoot?.querySelector('input');
    // input?.addEventListener('input', e => {
    //   console.log(e);
    // });
  }

  // validate() {
  //   if (this.validationCallback) {
  //     this._validationCallback(this.localStore.)
  //   }
  // }

  clear = () => {
    const input = this.shadowRoot?.querySelector('input');
    if (input?.value) {
      input.value = '';
    }
  }
}
