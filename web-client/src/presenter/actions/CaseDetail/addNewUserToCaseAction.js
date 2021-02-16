import { state } from 'cerebral';

/**
 * creates a new petitioner user and attaches it to the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const addNewUserToCaseAction = async ({ applicationContext, get }) => {
  const { docketNumber } = get(state.caseDetail);
  const email = get(state.form.email) || 'testing@example.com'; // TODO: remove fallback
  const name = 'Quentin Bass'; // TODO: no longer hard code

  await applicationContext.getUseCases().addNewUserToCaseInteractor({
    applicationContext,
    docketNumber,
    email,
    name,
  });
};
