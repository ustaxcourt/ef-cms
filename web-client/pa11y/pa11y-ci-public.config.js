const publicUser = require('./pa11y-public-user');
const publicUserSearch = require('./pa11y-public-user-search');
const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');

const initialUrls = [
  'http://localhost:5678/case-detail/101-19',
  'http://localhost:5678/case-detail/101-19/printable-docket-record',
];

const urls = [...initialUrls, ...publicUser, ...publicUserSearch].map(
  jsCheckDecorator,
);

module.exports = {
  defaults,
  urls,
};
