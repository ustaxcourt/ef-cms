module.exports = {
  plugins: ['babel-plugin-cerebral', 'transform-html-import-require-to-string'],
  presets: [
    [
      '@babel/env',
      {
        corejs: '3',
        targets: {
          chrome: '70',
          edge: '42',
          firefox: '63',
          ie: '11',
          safari: '12',
        },
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
};
