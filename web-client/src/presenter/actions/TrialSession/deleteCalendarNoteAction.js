import { state } from 'cerebral';

/**
 * delete a calendar note for a trial session on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const deleteCalendarNoteAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const trialSessionId = get(state.caseDetail.trialSessionId);

  const trialSession = await applicationContext
    .getUseCases()
    .saveCalendarNoteInteractor(applicationContext, {
      calendarNote: null,
      docketNumber,
      trialSessionId,
    });

  return {
    alertSuccess: {
      message: 'Note deleted.',
    },
    trialSession,
  };
};
