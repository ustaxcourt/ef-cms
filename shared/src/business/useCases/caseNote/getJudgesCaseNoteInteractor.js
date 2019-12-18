const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseNote } = require('../../entities/cases/CaseNote');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getJudgesCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get notes for
 * @returns {object} the case note object if one is found
 */
exports.getJudgesCaseNoteInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor({ applicationContext, user });

  const caseNote = await applicationContext
    .getPersistenceGateway()
    .getJudgesCaseNote({
      applicationContext,
      caseId,
      userId: judgeUser.userId,
    });

  if (caseNote) {
    return new CaseNote(caseNote).validate().toRawObject();
  }
};
