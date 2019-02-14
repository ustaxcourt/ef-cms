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
          userId: 'docketclerk1',
          section: 'docketclerk',
          role: 'docketclerk',
          name: 'Test Docketclerk',
          'custom:role': 'docketclerk',
          email: 'docketclerk1@example.com',
        },

        {
          userId: 'docketclerk2',
          section: 'docketclerk',
          name: 'Test Docketclerk2',
          role: 'docketclerk',
          email: 'docketclerk2@example.com',
        },
      ];
      break;
    case PETITIONS_SECTION:
      result = [
        {
          userId: 'petitionsclerk1',
          section: 'petitionsclerk',
          name: 'Test petitionsclerk',
          role: 'petitionsclerk',
          email: 'petitionsclerk',
        },
        {
          userId: 'petitionsclerk2',
          section: 'petitionsclerk',
          name: 'Test Petitionsclerk2',
          role: 'petitionsclerk',
          email: 'petitionsclerk2@example.com',
        },
      ];
      break;
    default:
      throw new Error('Invalid section provided');
  }

  return result;
};
