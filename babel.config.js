module.exports = {
  plugins: ['babel-plugin-cerebral', 'transform-html-import-require-to-string'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
      '@babel/preset-typescript',
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
