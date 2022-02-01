const fs = require('fs');
const path = require('path');
const {
  getEmailVerificationToken,
  reseedDatabase,
  setAllowedTerminalIpAddresses,
} = require('./database');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    getEmailVerificationToken({ userId }) {
      return getEmailVerificationToken({ userId });
    },
    modifyDeployedDateTextFile(deployedDate) {
      fs.writeFileSync(
        path.join(__dirname, '../../web-client/src/deployed-date.txt'),
        deployedDate,
      );
      return null;
    },
    seed() {
      return reseedDatabase();
    },
    setAllowedTerminalIpAddresses(ipAddresses) {
      return setAllowedTerminalIpAddresses(ipAddresses);
    },
  });
};
