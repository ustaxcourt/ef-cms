const { getEmailVerificationToken, reseedDatabase } = require('./database');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    getEmailVerificationToken({ userId }) {
      return getEmailVerificationToken({ userId });
    },
    seed() {
      return reseedDatabase();
    },
  });
};
