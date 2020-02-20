const petitionsclerk = require('./pa11y/pa11y-petitionsclerk');
const practitioner = require('./pa11y/pa11y-practitioner');
const respondent = require('./pa11y/pa11y-respondent');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...petitionsclerk, ...practitioner, ...respondent].map(
  jsCheckDecorator,
);

module.exports = {
  defaults,
  urls,
};
