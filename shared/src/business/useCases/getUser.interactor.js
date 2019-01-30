const User = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUser = async userId => {
  const user = new User({ userId }).toRawObject();
  return user;
};
