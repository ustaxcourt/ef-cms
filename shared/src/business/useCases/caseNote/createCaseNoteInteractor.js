const {
  isAuthorized,
  TRIAL_SESSION_WORKING_COPY,
} = require('../../../authorization/authorizationClientService');
const { CaseNote } = require('../../entities/cases/CaseNote');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id of the case to add notes to
 * @param {string} providers.notes the notes to add to the case for the logged in user
 * @returns {TrialSessionWorkingCopy} the created case note returned from persistence
 */
exports.createCaseNoteInteractor = async ({
  applicationContext,
  caseId,
  notes,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseNote = {
    caseId,
    notes,
    userId: user.userId,
  };

  const createdCaseNote = await applicationContext
    .getPersistenceGateway()
    .createCaseNote({
      applicationContext,
      caseNote,
    });

  const caseNoteEntity = new CaseNote(createdCaseNote).validate();
  return caseNoteEntity.toRawObject();
};
