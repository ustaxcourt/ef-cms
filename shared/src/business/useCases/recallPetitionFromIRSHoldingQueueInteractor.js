const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  InvalidEntityError,
  NotFoundError,
} = require('../../errors/errors');
const { Case } = require('../entities/Case');

const {
  createMappingRecord,
} = require('../../persistence/dynamo/helpers/createMappingRecord');
const {
  deleteMappingRecord,
} = require('../../persistence/dynamo/helpers/deleteMappingRecord');
/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.recallPetitionFromIRSHoldingQueue = async ({
  caseId,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError(
      'Unauthorized for recall from IRS Holding Queue',
    );
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
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
    initializeCaseWorkItem.recallFromIRSBatchSystem({ user });
    const invalidEntityError = new InvalidEntityError(
      'Invalid for recall from IRS',
    );
    caseEntity.validateWithError(invalidEntityError);

    caseEntity
      .recallFromIRSHoldingQueue()
      .validateWithError(invalidEntityError);

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.toRawObject(),
    });

    const batchedMessage = initializeCaseWorkItem.messages.find(
      message => message.message === 'Petition batched for IRS',
    );

    const fromUserId = batchedMessage.fromUserId;
    const createdAt = batchedMessage.createdAt;

    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: initializeCaseWorkItem.toRawObject(),
    });

    await deleteMappingRecord({
      applicationContext,
      pkId: fromUserId,
      skId: createdAt,
      type: 'outbox',
    });

    await deleteMappingRecord({
      applicationContext,
      pkId: 'petitions',
      skId: createdAt,
      type: 'outbox',
    });

    await createMappingRecord({
      applicationContext,
      pkId: initializeCaseWorkItem.assigneeId,
      skId: initializeCaseWorkItem.workItemId,
      type: 'workItem',
    });

    await createMappingRecord({
      applicationContext,
      pkId: initializeCaseWorkItem.section,
      skId: initializeCaseWorkItem.workItemId,
      type: 'workItem',
    });

    return caseEntity.toRawObject();
  } else {
    throw new NotFoundError(
      `Petition workItem for Case ${caseId} was not found`,
    );
  }
};
