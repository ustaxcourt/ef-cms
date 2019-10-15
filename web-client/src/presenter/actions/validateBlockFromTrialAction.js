import { state } from 'cerebral';

/**
 * validate the case or session note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateBlockFromTrialAction = ({ get, path }) => {
  const { reason } = get(state.modal);

  let errors = null;
  if (!reason) {
    errors = { reason: 'Reason must be defined' };
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
