import { state } from 'cerebral';

/**
 * takes the yes path if form.pendingEmail is set; takes the no path otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @returns {object} continue path for the sequence
 */
export const hasUpdatedEmailAction = async ({ get, path }) => {
  const { pendingEmail } = get(state.form);

  return pendingEmail ? path.yes() : path.no();
};
