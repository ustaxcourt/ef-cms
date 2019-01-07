const User = require('../entities/User');

/**
 * getUsersInSection
 * @param section
 * @returns {Promise<User[]>}
 */
exports.getUsersInSection = async section => {
  if (section === 'docket') {
    return [
      new User({ userId: 'docketclerk' }),
      new User({ userId: 'docketclerk1' }),
    ];
  } else {
    //returns all internal court users
    return [
      new User({ userId: 'docketclerk' }),
      new User({ userId: 'docketclerk1' }),
      new User({ userId: 'seniorattorney' }),
    ];
  }
};
