const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the inbox messages
 * @returns {object} the messages in the section inbox
 */
exports.getInboxMessagesForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getInboxMessagesForSection({
      applicationContext,
      section,
    });

  return workItems;
};
