import { state } from 'cerebral';

/**
 * sets the state.caseDetail.judgeNotes
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const getJudgeNotesForCaseAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const trialSessionId = get(state.caseDetail.trialSessionId);

  if (trialSessionId) {
    const trialSessionWorkingCopy = await applicationContext
      .getUseCases()
      .getTrialSessionWorkingCopyInteractor({
        applicationContext,
        trialSessionId,
      });

    if (trialSessionWorkingCopy) {
      const docketNumber = get(state.caseDetail.docketNumber);
      const judgeNotes =
        (trialSessionWorkingCopy.caseMetadata &&
          trialSessionWorkingCopy.caseMetadata[docketNumber] &&
          trialSessionWorkingCopy.caseMetadata[docketNumber].notes) ||
        '';

      store.set(state.caseDetail.judgeNotes, judgeNotes);
    }
  }
};
