const { User } = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUser = async user => {
  return new User(user).toRawObject();
};
