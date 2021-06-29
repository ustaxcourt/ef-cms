import { state } from 'cerebral';

/**
 * save a calendar note for a trial session on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const saveCalendarNoteAction = async ({ applicationContext, get }) => {
  const calendarNote = get(state.modal.note);
  const docketNumber = get(state.caseDetail.docketNumber);
  const trialSessionId =
    get(state.modal.trialSessionId) || get(state.caseDetail.trialSessionId);

  const trialSession = await applicationContext
    .getUseCases()
    .saveCalendarNoteInteractor(applicationContext, {
      calendarNote,
      docketNumber,
      trialSessionId,
    });

  return {
    alertSuccess: {
      message: 'Note saved.',
    },
    trialSession,
  };
};
