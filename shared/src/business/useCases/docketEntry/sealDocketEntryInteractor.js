const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * seals a given docket entry on a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id to strike
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the updated case after the docket entry is stricken
 */
exports.sealDocketEntryInteractor = async (
  applicationContext,
  { docketEntryId, docketEntrySealedTo, docketNumber },
) => {
  // check permissions
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  // get the case
  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError('Docket entry not found');
  }

  docketEntryEntity.sealEntry({ sealedTo: docketEntrySealedTo });

  console.log('docketEntrySealedTo', docketEntrySealedTo);
  console.log('sealedTo', docketEntryEntity.sealedTo);

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId,
    docketNumber,
    document: docketEntryEntity.validate().toRawObject(),
  });

  return docketEntryEntity.toRawObject();
};
