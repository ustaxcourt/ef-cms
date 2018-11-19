const User = require('../entities/User');

module.exports = userId => {
  if (userId === 'taxpayer') {
    return new User({
      userId: userId,
      role: 'taxpayer',
      firstName: 'Test',
      lastName: 'Taxpayer',
    });
  } else if (userId === 'petitionsclerk') {
    return new User({
      userId: userId,
      role: 'petitionsclerk',
      firstName: 'Petitions',
      lastName: 'Clerk',
    });
  }
  return;
};
