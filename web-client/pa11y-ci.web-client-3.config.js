const adc = require('./pa11y/pa11y-adc');
const petitioner = require('./pa11y/pa11y-petitioner');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...petitioner, ...adc].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls,
};
