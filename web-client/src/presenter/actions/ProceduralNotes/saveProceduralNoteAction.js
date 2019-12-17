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
  const proceduralNote = get(state.form.proceduralNote);
  const caseId = get(state.form.caseId);

  const results = await applicationContext
    .getUseCases()
    .saveProceduralNoteInteractor({
      applicationContext,
      caseId,
      proceduralNote,
    });

  return { results };
};
