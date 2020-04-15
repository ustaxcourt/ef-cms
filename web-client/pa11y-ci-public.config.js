const publicUser = require('./pa11y/pa11y-public-user');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const initialUrls = [
  'http://localhost:5678/case-detail/101-19',
  'http://localhost:5678/case-detail/101-19/generate-docket-record',
];

const urls = [...initialUrls, ...publicUser].map(jsCheckDecorator);

module.exports = {
  defaults,
  urls,
};
