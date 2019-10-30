const { ADC_SECTION, DOCKET_SECTION } = require('../../entities/WorkQueue');
const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the document qc
 * @returns {object} the work items in the section document inbox
 */
exports.getDocumentQCInboxForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const sectionToExcept =
    user.section === ADC_SECTION ? DOCKET_SECTION : section;

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      section: sectionToExcept,
    });

  return workItems;
};
