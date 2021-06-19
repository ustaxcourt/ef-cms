import { state } from 'cerebral';

/**
 * delete a case note from a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const deleteCaseNoteAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const caseDetail = await applicationContext
    .getUseCases()
    .deleteCaseNoteInteractor(applicationContext, {
      docketNumber,
    });

  return { caseDetail };
};
