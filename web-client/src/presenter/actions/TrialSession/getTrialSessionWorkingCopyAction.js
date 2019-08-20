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

  const trialSessionsCases = get(state.trialSessions.caseOrder);
  const caseIds = (trialSessionsCases || []).map(c => c.caseId);
  let caseNotes = new Array(caseIds.length);

  for (let i = 0; i < caseNotes.length; i++) {
    caseNotes[i] = await applicationContext
      .getUseCases()
      .getCaseNoteInteractor({
        applicationContext,
        caseId: caseIds[i],
      });
  }

  trialSessionWorkingCopy.caseNotes = makeMap(caseNotes, 'caseId');

  return { trialSessionWorkingCopy };
};
