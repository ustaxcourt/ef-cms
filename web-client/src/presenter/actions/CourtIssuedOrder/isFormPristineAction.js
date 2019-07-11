import { state } from 'cerebral';

/**
 * invokes the path in the sequeneces depending on if the form is pristine
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the path to execute
 */
export const isFormPristineAction = ({ get, path }) => {
  const pristine = get(state.screenMetadata.pristine);
  if (pristine) {
    return path['yes']();
  } else {
    return path['no']();
  }
};
