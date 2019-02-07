const Case = require('../entities/Case');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');

const {
  UnauthorizedError,
  InvalidEntityError,
  NotFoundError,
} = require('../../errors/errors');

/**
 *
 * @param caseId
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueue = async ({
  caseId,
  userId,
  applicationContext,
}) => {
  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for send to IRS Holding Queue');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      caseId,
      applicationContext,
    });

  if (!caseRecord) throw new NotFoundError(`Case ${caseId} was not found`);

  const caseEntity = new Case(caseRecord).validate();

  const petitionDocument = caseEntity.documents.find(
    document => document.documentType === Case.documentTypes.petitionFile,
  );
  const initializeCaseWorkItem = petitionDocument.workItems.find(
    workItem => workItem.isInitializeCase,
  );

  if (initializeCaseWorkItem) {
    initializeCaseWorkItem.assignToIRSBatchSystem({ userId });
    const invalidEntityError = new InvalidEntityError(
      'Invalid for send to IRS',
    );
    caseEntity.validateWithError(invalidEntityError);

    caseEntity.sendToIRSHoldingQueue().validateWithError(invalidEntityError);
    return await applicationContext.getPersistenceGateway().saveCase({
      caseToSave: caseEntity.toRawObject(),
      applicationContext,
    });
  } else {
    throw new NotFoundError(
      `Petition workItem for Case ${caseId} was not found`,
    );
  }
};
