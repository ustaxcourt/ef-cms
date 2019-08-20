const {
  isAuthorized,
  TRIAL_SESSION_WORKING_COPY,
} = require('../../../authorization/authorizationClientService');
const { CaseNote } = require('../../entities/cases/CaseNote');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update notes
 * @param {string} providers.notes the notes to update
 * @returns {object} the updated case note returned from persistence
 */
exports.updateCaseNoteInteractor = async ({
  applicationContext,
  caseId,
  notes,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseNoteToUpdate = {
    caseId,
    notes,
    userId: user.userId,
  };

  const updatedCaseNote = await applicationContext
    .getPersistenceGateway()
    .updateCaseNote({
      applicationContext,
      caseNoteToUpdate,
    });

  const caseNoteEntity = new CaseNote(updatedCaseNote).validate();
  return caseNoteEntity.toRawObject();
};
