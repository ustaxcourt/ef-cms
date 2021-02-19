import { state } from 'cerebral';

/**
 * validates the trial session with an updated note.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the trial session details
 * @param {object} providers.get the cerebral get function used for getting calendarNotes, trialSessionId, and docketNumber
 * @param {object} providers.path the next object in the path
 * @returns {object} the next path in the sequence
 */
export const validateTrialSessionNoteAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const trialSessionId = get(state.caseDetail.trialSessionId);
  const calendarNotes = get(state.modal.calendarNotes);

  const trialSession = await applicationContext
    .getUseCases()
    .getTrialSessionDetailsInteractor({
      applicationContext,
      trialSessionId: trialSessionId,
    });

  trialSession.caseOrder.some(sessionCase => {
    if (sessionCase.docketNumber === docketNumber) {
      sessionCase.calendarNotes = calendarNotes;
      return true;
    }
  });

  const errors = applicationContext
    .getUseCases()
    .validateTrialSessionInteractor({ applicationContext, trialSession });

  if (errors) {
    return path.error({
      alertError: {
        title: 'Calendar note invalid.',
      },
    });
  }
};
