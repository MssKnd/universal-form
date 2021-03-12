import style from './style.scss';
import html from './template.html';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { TextFieldStore } from './text-field-store';

type ValidationCallback = (input: string) => ValidationResult

const template = document.createElement('template');
template.innerHTML = `<style>${style}</style>${html}`;

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
    shadowRoot.appendChild(template.content.cloneNode(true));
    const input = this.shadowRoot?.querySelector('input');
    const inputContainer = this.shadowRoot?.querySelector<HTMLDivElement>('div.input');
    if (!input || !inputContainer) {
      return;
    }
    this.subscription.add(fromEvent(input, 'focus').subscribe(() => this.localStore.setIsForcus(true)));
    this.subscription.add(fromEvent(input, 'blur').subscribe(() => this.localStore.setIsForcus(false)));
    this.subscription.add(fromEvent(inputContainer, 'click').subscribe(() => input.focus()));
    this.subscription.add(fromEvent(input, 'input').pipe<string, string, string>(
      pluck('target', 'value'),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => this.localStore.setValue(value)));

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
