import { state } from 'cerebral';

/**
 * save a case note on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const saveCaseNoteAction = async ({ applicationContext, get }) => {
  const caseNote = get(state.modal.notes);
  const { caseId } = get(state.caseDetail);

  const caseDetail = await applicationContext
    .getUseCases()
    .saveCaseNoteInteractor({
      applicationContext,
      caseId,
      caseNote,
    });

  return {
    alertSuccess: {
      message: 'Your note has been saved',
    },
    caseDetail,
  };
};
