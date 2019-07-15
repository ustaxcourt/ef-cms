const {
  DOCKET_SECTION,
  SENIOR_ATTORNEY_SECTION,
} = require('../../entities/WorkQueue');
const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param applicationContext
 * @returns {Promise<*|*>}
 */
exports.getDocumentQCInboxForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const sectionToExcept =
    user.section === SENIOR_ATTORNEY_SECTION ? DOCKET_SECTION : section;

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      section: sectionToExcept,
    });

  return workItems;
};
