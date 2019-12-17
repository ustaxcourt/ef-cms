import { state } from 'cerebral';

/**
 * save a procedural note on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const saveProceduralNoteAction = async ({ applicationContext, get }) => {
  const proceduralNote = get(state.modal.notes);
  const { caseId } = get(state.caseDetail);

  const caseDetail = await applicationContext
    .getUseCases()
    .saveProceduralNoteInteractor({
      applicationContext,
      caseId,
      proceduralNote,
    });

  return {
    alertSuccess: {
      message: 'Your note has been saved',
    },
    caseDetail,
  };
};
