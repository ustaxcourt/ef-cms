const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * strikes a given docket record on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMeta document details to go on the record
 * @returns {object} the updated case after the documents are added
 */
exports.strikeDocketEntryInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketEntryEntity = caseEntity.getDocumentById({ documentId });

  if (!docketEntryEntity) {
    throw new NotFoundError('Docket entry not found');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  docketEntryEntity.strikeEntry({ name: user.name, userId: user.userId });

  caseEntity.updateDocketEntry(docketEntryEntity);

  await applicationContext.getPersistenceGateway().updateDocument({
    applicationContext,
    docketNumber,
    document: docketEntryEntity.validate().toRawObject(),
    documentId,
  });

  return caseEntity.toRawObject();
};
