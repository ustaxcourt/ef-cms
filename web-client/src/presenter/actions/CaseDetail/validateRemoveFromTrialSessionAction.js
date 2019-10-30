import { state } from 'cerebral';

/**
 * validate the remove from trial session form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateRemoveFromTrialSessionAction = ({ get, path }) => {
  const { disposition } = get(state.modal);

  let errors = null;
  if (!disposition) {
    errors = { disposition: 'Enter a disposition' };
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
