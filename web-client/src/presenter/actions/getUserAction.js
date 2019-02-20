import { state } from 'cerebral';

/**
 * gets the user based on the name provided.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function used for getting the state.form.name
 * @returns {Object} the user
 */
export default async ({ applicationContext, get }) => {
  const user = await applicationContext
    .getUseCases()
    .getUser(get(state.form.name));
  return { user };
};
