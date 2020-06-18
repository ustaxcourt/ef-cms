const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * gets a case message thread by parent id
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {object} the case message
 */
exports.getCaseMessageThreadInteractor = async ({
  applicationContext,
  parentMessageId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseMessages = await applicationContext
    .getPersistenceGateway()
    .getCaseMessageThreadByParentId({
      applicationContext,
      parentMessageId,
    });

  return CaseMessage.validateRawCollection(caseMessages, {
    applicationContext,
  });
};
