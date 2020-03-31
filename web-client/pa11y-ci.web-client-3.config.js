const adc = require('./pa11y/pa11y-adc');
const irsSuperuser = require('./pa11y/pa11y-irs-superuser');
const petitioner = require('./pa11y/pa11y-petitioner');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...petitioner, ...adc, ...irsSuperuser].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls,
};
