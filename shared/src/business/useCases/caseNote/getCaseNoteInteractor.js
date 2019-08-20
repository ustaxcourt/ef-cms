const {
  isAuthorized,
  TRIAL_SESSION_WORKING_COPY,
} = require('../../../authorization/authorizationClientService');
const { CaseNote } = require('../../entities/cases/CaseNote');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get notes for
 * @returns {Promise} the promise of the getCaseNote call
 */
exports.getCaseNoteInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseNote = await applicationContext
    .getPersistenceGateway()
    .getCaseNote({
      applicationContext,
      caseId,
      userId: user.userId,
    });

  const caseNoteEntity = new CaseNote(caseNote).validate();
  return caseNoteEntity.toRawObject();
};
