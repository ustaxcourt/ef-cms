const User = require('../../entities/User');

exports.getUser = async userId => {
  try {
    return new User({ userId: userId });
  } catch (err) {
    return null;
  }
};
