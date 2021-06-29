const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { UserCaseNote } = require('../../entities/notes/UserCaseNote');

/**
 * getUserCaseNoteForCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumbers the docket numbers of the cases to get notes for
 * @returns {object} the case note object if one is found
 */
exports.getUserCaseNoteForCasesInteractor = async (
  applicationContext,
  { docketNumbers },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor(applicationContext, { user });

  const caseNotes = await applicationContext
    .getPersistenceGateway()
    .getUserCaseNoteForCases({
      applicationContext,
      docketNumbers,
      userId: (judgeUser && judgeUser.userId) || user.userId,
    });

  return caseNotes.map(note => new UserCaseNote(note).validate().toRawObject());
};
