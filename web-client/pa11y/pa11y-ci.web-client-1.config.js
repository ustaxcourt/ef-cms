const { getOnly } = require('./helpers');

const chambers = require('./pa11y-chambers');
const docketclerk = require('./pa11y-docketclerk');
const floater = require('./pa11y-floater');
const general = require('./pa11y-general');
const judge = require('./pa11y-judge');
const reportersOffice = require('./pa11y-reportersOffice');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const userUrls = [
  ...chambers,
  ...floater,
  ...general,
  ...reportersOffice,
  ...docketclerk,
  ...judge,
];

const initialUrls = [
  'http://localhost:1234/',
  'http://localhost:1234/mock-login',
  'http://localhost:1234/request-for-page-that-doesnt-exist',
  'http://localhost:1234/idle-logout',
];

if (process.env.CI) {
  initialUrls.push({
    actions: ['wait for element #ci-environment to be visible'],
    notes: 'Confirm Pa11y is running against client in CI mode',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/&info=verify-ci-client-environment',
  });
}

const urls = [...initialUrls, ...userUrls].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls: getOnly(urls),
};
