const PX_1 = '.0625rem';
const PX_2 = '.125rem';
const PX_4 = '.25rem';
const PX_8 = '.5rem';

type ValidateFunction = (input: string) => void

class TextFieldElement extends HTMLElement {
  private _validateFunction: ValidateFunction | undefined;
  #isFocus = false;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const label = document.createElement('label');

    const style = document.createElement('style');
    style.innerText = `
    :host {
      display: flex;
    }
    div.main {
      background-color: pink;
      display: flex;
      padding: ${PX_8} ${PX_8} ${PX_8} ${PX_8};
      margin: 0;
      border: solid ${PX_1} #aaa;
      border-radius: ${PX_4};
    }
    input {
      width: 100%;
      border: none;
    }
    input:focus {
      outline: none;
    }
    `.replace(/\n/g,'').trim();
    const mainContainer = document.createElement('div');
    mainContainer.className = 'main';
    const leadingIcon = document.createElement('i');
    const input = document.createElement('input');
    input.addEventListener('focus', this.#focus);
    input.addEventListener('blur', this.#blur);
    const trailingIcon = document.createElement('i');
    input.setAttribute('type', 'text');

    mainContainer.appendChild(leadingIcon);
    mainContainer.appendChild(input);
    mainContainer.appendChild(trailingIcon);

    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom';

    mainContainer.appendChild(bottomContainer);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(label);
    shadowRoot.appendChild(mainContainer);
  }

  static get observedAttributes() {
    return ['label', 'name', 'disabled', 'required', 'readonly'];
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

      default:
        break;
    }
  }

  private connectedCallback() {
    console.log('connectedCallback');
  }

  private disconnectedCallback() {
    console.log('disconnectedCallback');
    const input = this.shadowRoot?.querySelector('input');
    input?.removeEventListener('focus', this.#focus);
    input?.removeEventListener('blur', this.#blur);
  }

  set validateFunction(fn: ValidateFunction) {
    this._validateFunction = fn;
  }

  #focus = () => {
    console.log('focus');
    this.#isFocus = true;
  };
  #blur = () => {
    console.log('blur');
    this.#isFocus = false;
  };
  // get name() {
  //   return this._name;
  // }

  // set name(v) {
  //   this.setAttribute("name", v);
  // }

  clear = () => {
    const input = this.shadowRoot?.querySelector('input');
    if (input?.value) {
      input.value = '';
    }
  }
}

customElements.define("text-field", TextFieldElement);
