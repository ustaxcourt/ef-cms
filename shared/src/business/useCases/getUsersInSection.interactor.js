const User = require('../entities/User');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
const {
  isAuthorized,
  WORKITEM,
} = require('../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../errors/errors');

/**
 * getUsersInSection
 * @param sectionType
 * @returns {Promise<User[]>}
 */
exports.getUsersInSection = async ({ section, applicationContext }) => {
  if (!isAuthorized(applicationContext.getCurrentUser().userId, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let result;

  if (section && section.sectionType === DOCKET_SECTION) {
    result = [
      new User({ userId: 'docketclerk' }).toRawObject(),
      new User({ userId: 'docketclerk1' }).toRawObject(),
    ];
  } else {
    throw new Error('Invalid section provided');
  }

  return User.validateRawCollection(result);
};
