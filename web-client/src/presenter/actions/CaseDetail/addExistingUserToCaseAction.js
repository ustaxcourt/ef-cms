import { state } from 'cerebral';

/**
 * attaches a petitioner to a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const addExistingUserToCaseAction = async ({
  applicationContext,
  get,
}) => {
  const { docketNumber } = get(state.caseDetail);
  const email = get(state.form.email) || 'petitioner1@example.com'; // TODO: remove fallback
  const name = 'Noble Burch'; // TODO: no longer hard code

  await applicationContext.getUseCases().addExistingUserToCaseInteractor({
    applicationContext,
    docketNumber,
    email,
    name,
  });
};
