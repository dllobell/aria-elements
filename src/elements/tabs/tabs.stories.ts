import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { registerTabs } from './tabs';

registerTabs();

const meta: Meta = {
  component: 'ui-tabs',
  title: 'Tabs',
  subcomponents: {},
  argTypes: {
    activation: {
      control: { type: 'select' },
      options: ['auto', 'manual'],
    },
  },
  args: {
    activation: 'auto',
  },
};

export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: (args) => {
    const data = [
      {
        name: 'Recent',
        items: [
          {
            title: 'Does drinking coffee make you smarter?',
            meta: ['5h ago', '5 comments', '2 shares'],
          },
          {
            title: "So you've bought coffee... now what?",
            meta: ['2h ago', '3 comments', '2 shares'],
          },
        ],
      },
      {
        name: 'Popular',
        items: [
          {
            title: 'Is tech making coffee better or worse?',
            meta: ['Jan 7', '29 comments', '16 shares'],
          },
          {
            title: 'The most innovative things happening in coffee',
            meta: ['Mar 19', '24 comments', '12 shares'],
          },
        ],
      },
      {
        name: 'Trending',
        items: [
          {
            title: 'Ask Me Anything: 10 answers to your questions about coffee',
            meta: ['2d ago', '9 comments', '5 shares'],
          },
          {
            title: "The worst advice we've ever heard about coffee",
            meta: ['4d ago', '1 comments', '2 shares'],
          },
        ],
      },
    ];

    return html`
      <ui-tabs
        activation=${args.activation}
        class="block w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
      >
        <ui-tab-list class="flex gap-6 border-b border-slate-200 text-sm font-medium text-slate-500">
          ${data.map(
            (tab) => html`
              <ui-tab
                class="relative -mb-px cursor-default border-b-2 border-transparent px-1 pt-2 pb-3 transition-colors data-selected:border-slate-900 data-selected:text-slate-900"
              >
                ${tab.name}
              </ui-tab>
            `,
          )}
        </ui-tab-list>

        <div class="mt-4">
          ${data.map(
            (tab, index) => html`
              <ui-tab-panel class="block rounded-xl bg-slate-50 p-4" ?hidden=${index !== 0}>
                <ul>
                  ${tab.items.map(
                    (item) => html`
                      <li class="relative rounded-lg p-3">
                        <h3 class="text-sm font-semibold text-slate-900">${item.title}</h3>
                        <ul class="mt-1 flex gap-2 text-xs text-slate-500">
                          <li>${item.meta[0]}</li>
                          <li>&middot;</li>
                          <li>${item.meta[1]}</li>
                          <li>&middot;</li>
                          <li>${item.meta[2]}</li>
                        </ul>
                      </li>
                    `,
                  )}
                </ul>
              </ui-tab-panel>
            `,
          )}
        </div>
      </ui-tabs>
    `;
  },
};

export const Vertical: Story = {
  render: (args) => {
    const data = [
      {
        name: 'Overview',
        items: [
          {
            title: 'Weekly sales performance for the espresso line',
            meta: ['Updated today', '4 notes', '1 share'],
          },
          {
            title: 'Traffic sources for the café newsletter',
            meta: ['Updated 2d ago', '7 notes', '3 shares'],
          },
        ],
      },
      {
        name: 'Insights',
        items: [
          {
            title: 'Customer feedback highlights from January',
            meta: ['Updated Jan 28', '12 notes', '5 shares'],
          },
          {
            title: 'Top performing menu experiments',
            meta: ['Updated Jan 19', '8 notes', '2 shares'],
          },
        ],
      },
      {
        name: 'Settings',
        items: [
          {
            title: 'Notification preferences for barista staff',
            meta: ['Updated Jan 12', '3 notes', '0 shares'],
          },
          {
            title: 'Holiday hours and staffing adjustments',
            meta: ['Updated Jan 4', '6 notes', '1 share'],
          },
        ],
      },
    ];

    return html`
      <ui-tabs
        orientation="vertical"
        activation=${args.activation}
        class="grid w-full max-w-2xl gap-6 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
        style="grid-template-columns: minmax(0, 12rem) minmax(0, 1fr);"
      >
        <ui-tab-list class="flex flex-col gap-1 border-r border-slate-200 pr-4 text-sm font-medium text-slate-500">
          ${data.map(
            (tab) => html`
              <ui-tab
                class="w-full cursor-default rounded-lg px-3 py-2 text-left transition-colors data-selected:bg-slate-900 data-selected:text-white"
              >
                ${tab.name}
              </ui-tab>
            `,
          )}
        </ui-tab-list>

        <div>
          ${data.map(
            (tab, index) => html`
              <ui-tab-panel class="block rounded-xl bg-slate-50 p-4" ?hidden=${index !== 0}>
                <ul>
                  ${tab.items.map(
                    (item) => html`
                      <li class="relative rounded-lg p-3">
                        <h3 class="text-sm font-semibold text-slate-900">${item.title}</h3>
                        <ul class="mt-1 flex gap-2 text-xs text-slate-500">
                          <li>${item.meta[0]}</li>
                          <li>&middot;</li>
                          <li>${item.meta[1]}</li>
                          <li>&middot;</li>
                          <li>${item.meta[2]}</li>
                        </ul>
                      </li>
                    `,
                  )}
                </ul>
              </ui-tab-panel>
            `,
          )}
        </div>
      </ui-tabs>
    `;
  },
};
