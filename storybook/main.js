module.exports = {
  stories: [
    // The order of stories here reflects the order in the sidebar.
    './stories/Welcome.mdx',
    './stories/Installation.mdx',
    './stories/**/*.mdx',
    './stories/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  features: {
    interactionsDebugger: true,
  },
};
