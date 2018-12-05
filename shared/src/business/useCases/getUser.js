const User = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUser = userId => {
  return new User({ userId: userId });
};
