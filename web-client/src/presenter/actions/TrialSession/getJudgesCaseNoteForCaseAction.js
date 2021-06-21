import { state } from 'cerebral';

/**
 * Fetches the judge's case note for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getUserCaseNoteInteractor use case
 * @param {object} providers.get the cerebral get function
 * @returns {object} contains the details of a userNote
 */
export const getJudgesCaseNoteForCaseAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  let userNote;

  try {
    userNote = await applicationContext
      .getUseCases()
      .getUserCaseNoteInteractor(applicationContext, {
        docketNumber,
      });
  } catch (err) {
    userNote = {};
  }

  return { userNote };
};
