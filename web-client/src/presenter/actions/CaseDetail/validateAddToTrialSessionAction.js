import { state } from 'cerebral';

/**
 * validate the add to trial session form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal.trialSessionId
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateAddToTrialSessionAction = ({ get, path }) => {
  const { trialSessionId } = get(state.modal);

  let errors = null;
  if (!trialSessionId) {
    errors = { trialSessionId: 'Select a Trial Session' };
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
