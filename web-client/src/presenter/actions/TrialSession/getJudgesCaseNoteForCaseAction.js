import { state } from 'cerebral';

/**
 * Fetches the judge's case note for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getJudgesCaseNoteInteractor use case
 * @param {object} providers.get the cerebral get function
 * @returns {object} contains the details of a judgesNote
 */
export const getJudgesCaseNoteForCaseAction = async ({
  applicationContext,
  get,
}) => {
  const caseId = get(state.caseDetail.caseId);

  let judgesNote;

  try {
    judgesNote = await applicationContext
      .getUseCases()
      .getJudgesCaseNoteInteractor({
        applicationContext,
        caseId,
      });
  } catch (err) {
    judgesNote = {};
  }

  return { judgesNote };
};
