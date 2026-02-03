import { computed, shallowRef, type Ref } from '@vue/reactivity';
import { defineElement, defineListener, defineProperty, inject, provide, type InjectionKey } from '../shared';
import { Focus, focusIn, FocusResult } from '../../utils/focus';

type Orientation = 'horizontal' | 'vertical';

type Activation = 'auto' | 'manual';

type TabsContext = {
  registerTab: (element: HTMLElement) => void;
  unregisterTab: (element: HTMLElement) => void;
  registerPanel: (element: HTMLElement) => void;
  unregisterPanel: (element: HTMLElement) => void;
  select: (index: number) => void;
  tabs: Ref<HTMLElement[]>;
  panels: Ref<HTMLElement[]>;
  selectedIndex: Ref<number>;
  orientation: Ref<Orientation>;
  activation: Ref<Activation>;
};

const TabsContext = Symbol('TabsContext') as InjectionKey<TabsContext>;

export const Tabs = defineElement(() => {
  const orientation = defineProperty<Orientation>('orientation', 'horizontal');
  const activation = defineProperty<Activation>('activation', 'auto');

  const tabs = shallowRef<HTMLElement[]>([]);
  const panels = shallowRef<HTMLElement[]>([]);

  const selectedIndex = shallowRef<number>(0);

  provide(TabsContext, {
    registerTab: (element: HTMLElement) => {
      tabs.value.push(element);
    },
    unregisterTab: (element: HTMLElement) => {
      const index = tabs.value.indexOf(element);
      if (index !== -1) {
        tabs.value.splice(index, 1);
      }
    },
    registerPanel: (element: HTMLElement) => {
      panels.value.push(element);
    },
    unregisterPanel: (element: HTMLElement) => {
      const index = panels.value.indexOf(element);
      if (index !== -1) {
        panels.value.splice(index, 1);
      }
    },
    select: (index: number) => {
      selectedIndex.value = index;
      tabs.value[index].focus();
    },
    tabs,
    panels,
    selectedIndex,
    orientation,
    activation,
  });

  return () => ({});
});

export const TabList = defineElement(() => {
  const context = inject(TabsContext);

  defineListener('keydown', (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
      case 'PageUp':
        event.preventDefault();
        event.stopPropagation();

        context.select(0);
        break;

      case 'End':
      case 'PageDown':
        event.preventDefault();
        event.stopPropagation();

        context.select(context.tabs.value.length - 1);
        break;
    }
  });

  return () => ({
    role: 'tablist',
    'aria-orientation': context.orientation.value,
  });
});

export const Tab = defineElement(({ element, cleanup }) => {
  const context = inject(TabsContext);

  context.registerTab(element);

  const index = computed(() => context.tabs.value.indexOf(element));

  const selected = computed(() => context.selectedIndex.value === index.value);

  function activateUsing(result: FocusResult) {
    if (result === FocusResult.Success && context.activation.value === 'auto') {
      const index = context.tabs.value.findIndex((tab) => tab === document.activeElement);

      if (index !== -1) {
        context.select(index);
      }
    }
  }

  defineListener('click', () => {
    context.select(index.value);

    element.focus();
  });

  defineListener('mousedown', (event) => {
    event.preventDefault();
  });

  defineListener('keydown', (event: KeyboardEvent) => {
    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();

        context.select(index.value);
        break;
      case 'ArrowLeft':
        if (context.orientation.value !== 'horizontal') return;

        event.preventDefault();
        event.stopPropagation();

        activateUsing(focusIn(context.tabs.value, Focus.Previous, { wrap: true }));
        break;

      case 'ArrowUp':
        if (context.orientation.value !== 'vertical') return;

        event.preventDefault();
        event.stopPropagation();

        activateUsing(focusIn(context.tabs.value, Focus.Previous, { wrap: true }));
        break;

      case 'ArrowRight':
        if (context.orientation.value !== 'horizontal') return;

        event.preventDefault();
        event.stopPropagation();

        activateUsing(focusIn(context.tabs.value, Focus.Next, { wrap: true }));
        break;
      case 'ArrowDown':
        if (context.orientation.value !== 'vertical') return;

        event.preventDefault();
        event.stopPropagation();

        activateUsing(focusIn(context.tabs.value, Focus.Next, { wrap: true }));
        break;
    }
  });

  cleanup(() => {
    context.unregisterTab(element);
  });

  return () => ({
    role: 'tab',
    tabindex: selected.value ? 0 : -1,
    'aria-selected': selected.value,
    'data-selected': selected.value ? '' : undefined,
  });
});

export const TabPanel = defineElement(({ element, cleanup }) => {
  const context = inject(TabsContext);

  context.registerPanel(element);

  const index = computed(() => context.panels.value.indexOf(element));

  const selected = computed(() => context.selectedIndex.value === index.value);

  cleanup(() => {
    context.unregisterPanel(element);
  });

  return () => ({
    role: 'tabpanel',
    hidden: !selected.value ? '' : undefined,
  });
});

export function registerTabs() {
  customElements.define('ui-tabs', Tabs);
  customElements.define('ui-tab-list', TabList);
  customElements.define('ui-tab', Tab);
  customElements.define('ui-tab-panel', TabPanel);
}
