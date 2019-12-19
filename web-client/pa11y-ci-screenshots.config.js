const sanitize = require('sanitize-filename');

const adc = require('./pa11y/pa11y-adc');
const docketclerk = require('./pa11y/pa11y-docketclerk');
const judge = require('./pa11y/pa11y-judge');
const petitioner = require('./pa11y/pa11y-petitioner');
const petitionsclerk = require('./pa11y/pa11y-petitionsclerk');
const practitioner = require('./pa11y/pa11y-practitioner');
const respondent = require('./pa11y/pa11y-respondent');

const userUrls = [
  ...docketclerk,
  ...judge,
  ...petitioner,
  ...petitionsclerk,
  ...practitioner,
  ...respondent,
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
  const screenCapturePath = './web-client/pa11y/pa11y-screenshots/new';
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
    concurrency: 3,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    useIncognitoBrowserContext: true,
    wait: 5000,
  },
  urls: screenshotUrls,
};
