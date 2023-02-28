import { state } from 'cerebral';

/**
 * validate the set case as high priority modal
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePrioritizeCaseAction = ({ get, path }) => {
  const { reason } = get(state.modal);

  let errors = null;
  if (!reason) {
    errors = { reason: 'Provide a reason' };
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
