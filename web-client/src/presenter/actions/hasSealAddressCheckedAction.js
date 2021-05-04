import { state } from 'cerebral';

/**
 * takes the yes path if seal address checkbox has been checked on the form;
 * takes the no path otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @returns {object} continue path for the sequence
 */
export const hasSealAddressCheckedAction = async ({ get, path }) => {
  const form = get(state.form);

  if (form.sealAddress) {
    return path.yes();
  }

  return path.no();
};
