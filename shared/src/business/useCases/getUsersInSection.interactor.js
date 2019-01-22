const User = require('../entities/User');
const { DOCKET_SECTION, PETITIONS_SECTION } = require('../entities/WorkQueue');
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

  if (!section) throw new Error('A section must be provided');

  let result;

  switch (section.sectionType) {
    case DOCKET_SECTION:
      result = [
        new User({ userId: 'docketclerk' }).toRawObject(),
        new User({ userId: 'docketclerk1' }).toRawObject(),
      ];
      break;
    case PETITIONS_SECTION:
      result = [
        new User({ userId: 'petitionsclerk' }).toRawObject(),
        new User({ userId: 'petitionsclerk1' }).toRawObject(),
      ];
      break;
    default:
      throw new Error('Invalid section provided');
  }

  return User.validateRawCollection(result);
};
