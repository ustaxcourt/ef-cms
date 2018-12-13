const User = require('../../entities/User');

exports.getUser = async ({ token }) => {
  try {
    return new User({ userId: token });
  } catch (err) {
    return null;
  }
};
