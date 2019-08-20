import { state } from 'cerebral';

/**
 * Fetches the details about a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getTrialSessionDetails use case
 * @param {object} providers.get the cerebral get function
 * @returns {object} contains the details of a caseNote
 */
export const getCaseNoteForCaseAction = async ({ applicationContext, get }) => {
  const caseId = get(state.caseDetail.caseId);

  let caseNote;

  try {
    caseNote = await applicationContext.getUseCases().getCaseNoteInteractor({
      applicationContext,
      caseId,
    });
  } catch (err) {
    caseNote = {};
  }

  return { caseNote };
};
