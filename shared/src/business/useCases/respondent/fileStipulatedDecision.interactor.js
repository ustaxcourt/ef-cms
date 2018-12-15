const {
  isAuthorized,
  FILE_STIPULATED_DECISION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.fileStipulatedDecision = async ({
  userId,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_STIPULATED_DECISION)) {
    throw new UnauthorizedError('Unauthorized to upload a stipulated decision');
  }

  return await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    document,
  });
};
