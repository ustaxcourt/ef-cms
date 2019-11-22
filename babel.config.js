module.exports = {
  plugins: ['babel-plugin-cerebral', 'transform-html-import-require-to-string'],
  presets: [
    [
      '@babel/env',
      {
        corejs: '3',
        targets: {
          chrome: '78',
          firefox: '70',
          safari: '13',
        },
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
};
