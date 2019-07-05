import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {void}
 */
export const updatePrimaryContactAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  await applicationContext.getUseCases().updatePrimaryContactInteractor({
    applicationContext,
    caseToUpdate,
  });
};
