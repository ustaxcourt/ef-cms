const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { IRS_BATCH_SYSTEM_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param applicationContext
 * @returns {Promise<*|*>}
 */
exports.getDocumentQCServedForSection = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM, user.userId)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCServedForSection({
      applicationContext,
      section,
    });

  return workItems.filter(workItem => {
    return user.role === 'petitionsclerk'
      ? workItem.section === IRS_BATCH_SYSTEM_SECTION
      : true;
  });
};
