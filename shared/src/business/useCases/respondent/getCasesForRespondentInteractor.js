const {
  isAuthorized,
  PETITION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { Case } = require('../../entities/Case');

/**
 * getCasesForRespondent
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesForRespondent = async ({
  respondentId,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, PETITION, respondentId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesForRespondent({
      applicationContext,
      respondentId,
    });
  return Case.validateRawCollection(cases);
};
