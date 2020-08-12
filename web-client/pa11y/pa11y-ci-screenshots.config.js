const sanitize = require('sanitize-filename');

const adc = require('./pa11y-adc');
const docketclerk = require('./pa11y-docketclerk');
const irsPractitioner = require('./pa11y-irs-practitioner');
const judge = require('./pa11y-judge');
const petitioner = require('./pa11y-petitioner');
const petitionsclerk = require('./pa11y-petitionsclerk');
const privatePractitioner = require('./pa11y-private-practitioner');

const screenCapturePath = './pa11y-screenshots/new';

const userUrls = [
  ...docketclerk,
  ...judge,
  ...petitioner,
  ...petitionsclerk,
  ...privatePractitioner,
  ...irsPractitioner,
  ...adc,
];

const initialUrls = [
  'http://localhost:1234/',
  'http://localhost:1234/mock-login',
  'http://localhost:1234/request-for-page-that-doesnt-exist',
  'http://localhost:1234/idle-logout',
];

const urls = [...initialUrls, ...userUrls];

const screenshotUrls = urls.map(item => {
  const urlRegex = /^.*&path=/;
  if (typeof item === 'object') {
    const urlPath = item.url.replace(urlRegex, '');
    item.screenCapture = `${screenCapturePath}/${sanitize(urlPath)}.png`;
  } else if (typeof item === 'string') {
    const url = item;
    const urlPath = url.replace(urlRegex, '');
    item = {
      screenCapture: `${screenCapturePath}/${sanitize(urlPath)}.png`,
      url,
    };
  }
  return item;
});

// see https://github.com/pa11y/pa11y#command-line-interface

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
    concurrency: 3,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    wait: 5000,
  },
  urls: screenshotUrls,
};
