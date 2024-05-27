const { getOnly, setTimeouts } = require('./helpers');

const chambers = require('./pa11y-chambers');
const floater = require('./pa11y-floater');
const general = require('./pa11y-general');
const irsPractitioner = require('./pa11y-irs-practitioner');
const judge = require('./pa11y-judge');
const misc = require('./pa11y-misc.js');
const privatePractitioner = require('./pa11y-private-practitioner');
const reportersOffice = require('./pa11y-reportersOffice');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const userUrls = [
  ...chambers,
  ...floater,
  ...general,
  ...privatePractitioner,
  ...irsPractitioner,
  ...reportersOffice,
  ...judge,
];

const urls = [...userUrls, ...misc].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
