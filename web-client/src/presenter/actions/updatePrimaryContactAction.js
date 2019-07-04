import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {void}
 */
export const updatePrimaryContactAction = async ({ get }) => {
  console.log(get(state.form));
};
