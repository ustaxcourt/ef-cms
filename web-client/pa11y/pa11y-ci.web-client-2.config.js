const { getOnly, setTimeouts } = require('./helpers');

const petitionsclerk = require('./pa11y-petitionsclerk');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...petitionsclerk].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
