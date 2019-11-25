module.exports = {
  plugins: ['babel-plugin-cerebral'],
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
