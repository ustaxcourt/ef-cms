const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * setWorkItemAsReadInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.workItemId the id of the work item to set as read
 * @returns {Promise} the promise of the setWorkItemAsRead call
 */
exports.setWorkItemAsReadInteractor = async (
  applicationContext,
  { workItemId },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItemRecord = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({ applicationContext, workItemId });

  const { docketNumber } = workItemRecord;
  const { docketEntryId } = workItemRecord.docketEntry;

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(
      `Docket entry ${docketEntryId} was not found on the case ${docketNumber}`,
    );
  }

  docketEntryEntity.workItem.markAsRead();

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId,
    docketNumber,
    document: docketEntryEntity.validate().toRawObject(),
  });

  return await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: docketEntryEntity.workItem.validate().toRawObject(),
  });
};
