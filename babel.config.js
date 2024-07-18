module.exports = {
  plugins: [
    'babel-plugin-cerebral',
    'transform-html-import-require-to-string',
    ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  sourceType: 'unambiguous',
  targets: 'defaults',
};
