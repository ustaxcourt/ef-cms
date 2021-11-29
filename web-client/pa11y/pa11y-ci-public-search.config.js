const publicUserSearch = require('./pa11y-public-user-search');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...publicUserSearch].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls,
};
