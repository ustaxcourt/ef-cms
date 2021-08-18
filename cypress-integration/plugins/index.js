const { reseedDatabase } = require('./database');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    seed() {
      return reseedDatabase();
    },
  });
};
