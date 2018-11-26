const User = require('../entities/User');

module.exports = userId => {
  if (userId === 'taxpayer') {
    return new User({
      firstName: 'Test',
      lastName: 'Taxpayer',
      role: 'taxpayer',
      token: 'taxpayer',
      userId: userId,
    });
  } else if (userId === 'petitionsclerk') {
    return new User({
      firstName: 'Petitions',
      lastName: 'Clerk',
      role: 'petitionsclerk',
      token: 'petitionsclerk',
      userId: userId,
    });
  }
  return;
};
