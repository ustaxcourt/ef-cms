const { User } = require('../entities/User');

/**
 * getUserInteractor
 *
 * @param {object} user the user to get
 * @returns {User} the retrieved user
 */
exports.getUserInteractor = async user => {
  return new User(user).toRawObject();
};
