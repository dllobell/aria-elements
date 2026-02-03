import type { StorybookConfig } from '@storybook/web-components-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  viteFinal: async (config) => {
    const plugins = await withoutVitePlugins(config.plugins || [], ['vite:dts']);

    return {
      ...config,
      plugins: [...plugins, await import('@tailwindcss/vite').then((m) => m.default())],
    };
  },
};
export default config;
