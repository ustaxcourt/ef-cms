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

  let { userId } = user;

  if (user.isChambersUser()) {
    const judgeUser = await applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper(applicationContext, { section: user.section });
    if (judgeUser) {
      ({ userId } = judgeUser);
    }
  }

  const caseNotes = await applicationContext
    .getPersistenceGateway()
    .getUserCaseNoteForCases({
      applicationContext,
      docketNumbers,
      userId,
    });

  return caseNotes.map(note => new UserCaseNote(note).validate().toRawObject());
};
