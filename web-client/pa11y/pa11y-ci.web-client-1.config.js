const { getOnly, setTimeouts } = require('./helpers');

const chambers = require('./pa11y-chambers');
const floater = require('./pa11y-floater');
const general = require('./pa11y-general');
const misc = require('./pa11y-misc.js');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const userUrls = [...chambers, ...floater, ...general];

const urls = [...userUrls, ...misc].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
