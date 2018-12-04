const Case = require('../entities/Case');
const { getCase } = require('./getCase');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../authorization/authorizationClientService');

const {
  UnprocessableEntityError,
  UnauthorizedError,
  InvalidEntityError,
} = require('../errors/errors');

exports.sendPetitionToIRS = async ({ caseId, userId, applicationContext }) => {
  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for send to IRS');
  }

  const caseRecord = await getCase({
    userId,
    caseId,
    applicationContext,
  });

  let caseEntity;
  if (!caseRecord) {
    throw new UnprocessableEntityError('Case not found.');
  }

  caseEntity = new Case(caseRecord);
  const invalidEntityError = new InvalidEntityError('Invalid for send to IRS');
  caseEntity.validateWithError(invalidEntityError);

  try {
    await applicationContext.irsGateway.sendToIRS({
      caseToSend: { ...caseEntity },
      applicationContext,
    });
  } catch (error) {
    throw new Error(`error sending ${caseId} to IRS: ${error.message}`);
  }

  caseEntity.markAsSentToIRS();
  caseEntity.validateWithError(invalidEntityError);

  await applicationContext.persistence.saveCase({
    caseToSave: { ...caseEntity },
    applicationContext,
  });

  return caseEntity.irsSendDate;
};
