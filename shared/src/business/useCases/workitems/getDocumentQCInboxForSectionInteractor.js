const {
  DOCKET_SECTION,
  IRS_BATCH_SYSTEM_SECTION,
  PETITIONS_SECTION,
} = require('../../entities/WorkQueue');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
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

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  let sectionToShow = section;
  if (section !== IRS_BATCH_SYSTEM_SECTION && section !== PETITIONS_SECTION) {
    sectionToShow = DOCKET_SECTION;
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      section: sectionToShow,
    });

  return workItems;
};
