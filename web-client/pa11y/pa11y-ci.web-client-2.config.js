const { getOnly, setTimeouts } = require('./helpers');

const irsPractitioner = require('./pa11y-irs-practitioner');
const petitionsclerk = require('./pa11y-petitionsclerk');
const privatePractitioner = require('./pa11y-private-practitioner');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [
  ...petitionsclerk,
  ...privatePractitioner,
  ...irsPractitioner,
].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
