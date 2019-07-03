const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getInboxMessagesForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
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
