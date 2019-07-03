const { User } = require('../entities/User');
/**
 * getUserInteractor
 * @param userId
 * @returns {User}
 */
exports.getUserInteractor = async user => {
  return new User(user).toRawObject();
};
