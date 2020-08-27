const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
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
  docketRecordId,
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

  const docketRecord = caseEntity.getDocketRecord(docketRecordId);

  if (!docketRecord) {
    throw new NotFoundError('Docket Record not found');
  }

  const docketRecordEntity = new DocketRecord(docketRecord, {
    applicationContext,
  });

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  docketRecordEntity.strikeEntry({ name: user.name, userId: user.userId });

  caseEntity.updateDocketRecordEntry(
    docketRecordEntity,
    docketRecordEntity.index,
  );

  await applicationContext.getPersistenceGateway().updateDocketRecord({
    applicationContext,
    docketNumber,
    docketRecord: docketRecordEntity.validate().toRawObject(),
    docketRecordId: docketRecordId,
  });

  return caseEntity.toRawObject();
};
