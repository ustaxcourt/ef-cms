const User = require('../entities/User');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUsersInSection = async section => {
  if (section === DOCKET_SECTION) {
    return [
      new User({ userId: 'docketclerk' }),
      new User({ userId: 'docketclerk1' }),
    ];
  } else {
    return [];
  }
};
