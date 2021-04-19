module.exports = {
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-cerebral',
    'transform-html-import-require-to-string',
  ],
  presets: [
    [
      '@babel/env',
      {
        targets: {
          chrome: '78',
          firefox: '70',
          safari: '13',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  sourceType: 'unambiguous',
  targets: 'defaults',
};
