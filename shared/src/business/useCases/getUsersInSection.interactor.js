const User = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUsersInSection = async section => {
  if (section === 'docket') {
    return [
      new User({ userId: 'docketclerk' }),
      new User({ userId: 'docketclerk1' }),
    ];
  } else {
    return [];
  }
};
