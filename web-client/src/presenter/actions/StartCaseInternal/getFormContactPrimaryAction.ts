import { state } from 'cerebral';

/**
 * return contactPrimary from the form state
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} primary contact object
 */
export const getFormContactPrimaryAction = ({ get }) => {
  const contact = get(state.form.contactPrimary);

  return { contact };
};
