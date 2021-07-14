const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { UserCaseNote } = require('../../entities/notes/UserCaseNote');

/**
 * getUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get notes for
 * @returns {object} the case note object if one is found
 */
exports.getUserCaseNoteInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor(applicationContext, { user });

  const caseNote = await applicationContext
    .getPersistenceGateway()
    .getUserCaseNote({
      applicationContext,
      docketNumber,
      userId: (judgeUser && judgeUser.userId) || user.userId,
    });

  if (caseNote) {
    return new UserCaseNote(caseNote).validate().toRawObject();
  }
};
