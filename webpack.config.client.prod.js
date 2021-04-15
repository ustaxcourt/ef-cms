const config = require('./webpack.config.client');

module.exports = {
  ...config,
  entry: {
    main: './web-client/src/index.prod.js',
  },
  mode: 'production',
};
