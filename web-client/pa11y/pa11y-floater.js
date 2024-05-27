const { defaults, jsCheckDecorator } = require('./pa11y-ci.base-config.js');
const { getOnly, setTimeouts } = require('./helpers.js');
const { loginAs } = require('./helpers');

const tests = [
  {
    actions: [...loginAs({ username: 'floater@example.com' })],
    url: 'http://localhost:1234/',
  },
];

const urls = tests.map(jsCheckDecorator);

module.exports = {
  defaults,
  urls: getOnly(urls).map(setTimeouts),
};
