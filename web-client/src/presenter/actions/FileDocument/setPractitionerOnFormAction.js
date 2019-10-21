import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {object} the next path based on if validation was successful or error
 */
export const setPractitionerOnFormAction = async ({ get, store }) => {
  const user = get(state.user);

  if (user.role === 'practitioner') {
    store.set(state.form.practitioner, [{ ...user, partyPractitioner: true }]);
  }
};
