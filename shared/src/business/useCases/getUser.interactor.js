const User = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUser = async userId => {
  let user;
  try {
    user = new User({ userId }).toRawObject();
  } catch (err) {
    console.error(err);
    throw err;
  }
  return user;
};
