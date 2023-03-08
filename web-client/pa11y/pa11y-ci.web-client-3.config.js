const { getOnly, setTimeouts } = require('./helpers');

const adc = require('./pa11y-adc');
const admissionsClerk = require('./pa11y-admissionsclerk');
const irsSuperuser = require('./pa11y-irs-superuser');
const petitioner = require('./pa11y-petitioner');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...petitioner, ...adc, ...irsSuperuser, ...admissionsClerk].map(
  jsCheckDecorator,
);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
