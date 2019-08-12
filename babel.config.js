module.exports = {
  plugins: ['babel-plugin-cerebral', 'transform-html-import-require-to-string'],
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '2',
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
