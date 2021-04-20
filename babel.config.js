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
