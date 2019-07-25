const { User } = require('../entities/User');

/**
 * getUserInteractor
 * @param user
 * @returns {User}
 */
exports.getUserInteractor = async user => {
  return new User(user).toRawObject();
};
