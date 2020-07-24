const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * gets case messages for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case message
 */
exports.getCaseMessagesForCaseInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseMessages = await applicationContext
    .getPersistenceGateway()
    .getCaseMessagesByDocketNumber({
      applicationContext,
      docketNumber,
    });

  return CaseMessage.validateRawCollection(caseMessages, {
    applicationContext,
  });
};
