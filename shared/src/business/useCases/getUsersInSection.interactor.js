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
  if (!isAuthorized(applicationContext.getCurrentUser(), WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!section) throw new Error('A section must be provided');

  let result;

  // TODO: need to fetch the real users in section
  switch (section.sectionType) {
    case DOCKET_SECTION:
      result = [
        {
          userId: 'docketclerk',
          section: 'docketclerk',
          name: 'Test Docketclerk',
          'custom:role': 'docketclerk',
          email: 'docketclerk',
        },

        {
          userId: 'docketclerk1',
          section: 'docketclerk',
          name: 'Test Docketclerk1',
          'custom:role': 'docketclerk',
          email: 'docketclerk1',
        },
      ];
      break;
    case PETITIONS_SECTION:
      result = [
        {
          userId: 'petitionsclerk',
          section: 'petitionsclerk',
          name: 'Test petitionsclerk',
          'custom:role': 'petitionsclerk',
          email: 'petitionsclerk',
        },
        {
          userId: 'petitionsclerk1',
          section: 'petitionsclerk',
          name: 'Test petitionsclerk1',
          'custom:role': 'petitionsclerk',
          email: 'petitionsclerk1',
        },
      ];
      break;
    default:
      throw new Error('Invalid section provided');
  }

  return result;
};
