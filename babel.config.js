module.exports = {
  plugins: ['babel-plugin-cerebral'],
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
