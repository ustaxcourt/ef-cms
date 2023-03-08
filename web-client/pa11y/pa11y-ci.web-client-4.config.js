const { getOnly, setTimeouts } = require('./helpers');

const docketclerk = require('./pa11y-docketclerk');
const judge = require('./pa11y-judge');
const reportersOffice = require('./pa11y-reportersOffice');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const urls = [...docketclerk, ...judge, ...reportersOffice].map(
  jsCheckDecorator,
);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
