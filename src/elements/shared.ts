import { effect, shallowRef, type Ref } from '@vue/reactivity';

let current: UIElement | null = null;

type AttributeValue = string | number | boolean | null | undefined;

type CleanupCallback = () => void;

type MountFunction = (context: {
  element: HTMLElement;
  cleanup: (callback: CleanupCallback) => void;
}) => () => Record<string, AttributeValue>;

export function defineElement(mount: MountFunction): typeof UIElement {
  return class extends UIElement {
    constructor() {
      super(mount);
    }
  };
}

export function defineProperty<T>(name: string, initialValue: T): Ref<T> {
  if (!current) throw new Error('No current instance');

  const attributeValue = current.getAttribute(name) as unknown as T;

  const value = shallowRef<T>(attributeValue || initialValue);

  current._properties[name] = value;

  return value;
}

export function defineListener<K extends keyof HTMLElementEventMap>(
  name: K,
  callback: (event: HTMLElementEventMap[K]) => void,
): void;
export function defineListener(name: string, callback: (event: Event) => void): void;
export function defineListener(name: string, callback: (event: Event) => void): void {
  if (!current) throw new Error('No current instance');

  current.addEventListener(name, callback);

  current._cleanups.push(() => {
    current?.removeEventListener(name, callback);
  });
}

interface InjectionConstraint<_T> {}

export type InjectionKey<T> = symbol & InjectionConstraint<T>;

export function provide<T>(key: InjectionKey<T>, context: T) {
  if (!current) {
    throw new Error('No current instance');
  }

  current._provides[key] = context;
}

export function inject<T>(key: InjectionKey<T>): T {
  if (!current) {
    throw new Error('No current instance');
  }

  const context = current._parent?._provides[key] as T | undefined;

  if (!context) {
    throw new Error('No context found for the given key');
  }

  return context;
}

export class UIElement extends HTMLElement {
  private readonly mount: MountFunction;

  public _parent: UIElement | null = null;
  public _provides: Record<symbol, unknown> = {};
  public _properties: Record<string, unknown> = {};
  public _cleanups: CleanupCallback[] = [];

  private _observer: MutationObserver | null = null;

  constructor(mount: MountFunction) {
    super();

    this.mount = mount;
  }

  connectedCallback() {
    let parent = this.parentElement;
    while (parent) {
      if (parent instanceof UIElement) {
        this._parent = parent;
        Object.setPrototypeOf(this._provides, this._parent._provides);
        break;
      }

      parent = parent.parentElement;
    }

    current = this;

    const cleanup = (callback: CleanupCallback) => {
      this._cleanups.push(callback);
    };

    const runner = this.mount({ element: this, cleanup });

    current = null;

    this._observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const key = mutation.attributeName!;

        if (this._properties[key]) {
          const property = this._properties[key] as Ref<string | null>;
          property.value = this.getAttribute(key);
        }
      }
    });

    this._observer.observe(this, { attributeFilter: Object.keys(this._properties) });

    effect(() => {
      const attributes = runner();

      for (const [key, value] of Object.entries(attributes)) {
        if (value !== undefined) {
          this.setAttribute(key, String(value));
        } else {
          this.removeAttribute(key);
        }
      }
    });
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;

    for (const cleanup of this._cleanups) {
      cleanup();
    }

    this._cleanups = [];
  }
}
