import { makeMap } from '../../computeds/makeMap';
import { state } from 'cerebral';

/**
 * Fetches the trial session working copy using the getTrialSessionWorkingCopy use case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getTrialSessionWorkingCopy use case
 * @param {Function} providers.get the cerebral get helper function
 * @returns {object} contains the trial session working copy returned from the use case
 */
export const getTrialSessionWorkingCopyAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { trialSessionId } = props;

  const trialSessionWorkingCopy = await applicationContext
    .getUseCases()
    .getTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionId,
    });

  const trialSessionsCases = get(state.trialSession.caseOrder);
  const caseIds = (trialSessionsCases || []).map(c => c.caseId);
  let caseNotes = [];
  let caseNote;

  for (let i = 0; i < caseIds.length; i++) {
    caseNote = await applicationContext.getUseCases().getCaseNoteInteractor({
      applicationContext,
      caseId: caseIds[i],
    });

    if (caseNote && caseNote.notes) {
      caseNotes.push(caseNote);
    }
  }

  trialSessionWorkingCopy.caseNotes = makeMap(caseNotes, 'caseId');

  return { trialSessionWorkingCopy };
};
