const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * removePdfFromDocketEntryInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.docketEntryId the docket entry id for the file to be removed
 * @returns {object} the updated case data
 */
exports.removePdfFromDocketEntryInteractor = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, {
    applicationContext,
  });

  const docketEntry = caseEntity.getDocketEntryById({ docketEntryId });

  if (docketEntry && docketEntry.isFileAttached) {
    await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
      applicationContext,
      key: docketEntryId,
    });

    docketEntry.isFileAttached = false;
    caseEntity.updateDocketEntry(docketEntry);

    const updatedCase = await applicationContext
      .getPersistenceGateway()
      .updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      });

    return new Case(updatedCase, { applicationContext }).toRawObject();
  }
};
