const User = require('../entities/User');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
/**
 * getUsersInSection
 * @param sectionType
 * @returns {Promise<User[]>}
 */
exports.getUsersInSection = async ({ sectionType }) => {
  if (sectionType === DOCKET_SECTION) {
    return [
      new User({ userId: 'docketclerk' }).toRawObject(),
      new User({ userId: 'docketclerk1' }).toRawObject(),
    ];
  } else {
    //returns all internal court users
    return [
      new User({ userId: 'docketclerk' }).toRawObject(),
      new User({ userId: 'docketclerk1' }).toRawObject(),
      new User({ userId: 'seniorattorney' }).toRawObject(),
    ];
  }
};
