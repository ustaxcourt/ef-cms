import { state } from 'cerebral';

/**
 * returns yes path if useExistingAddress is true, no otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} continue path for the sequence
 */
export const shouldUseExistingAddressAction = ({ get, path }) => {
  const useExistingAddress = get(state.form.useExistingAddress);

  if (useExistingAddress) {
    return path.yes();
  } else {
    return path.no();
  }
};
