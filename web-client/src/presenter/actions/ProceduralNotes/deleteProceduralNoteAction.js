import { state } from 'cerebral';

/**
 * delete a procedural note from a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const deleteProceduralNoteAction = async ({
  applicationContext,
  get,
}) => {
  const caseId = get(state.caseDetail.caseId);
  const caseDetail = await applicationContext
    .getUseCases()
    .deleteProceduralNoteInteractor({
      applicationContext,
      caseId,
    });

  return { caseDetail };
};
