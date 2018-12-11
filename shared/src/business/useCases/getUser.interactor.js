const User = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUser = async userId => {
  try {
    return new User({ userId });
  } catch (err) {
    return null;
  }
};
