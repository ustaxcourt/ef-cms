import { state } from '@web-client/presenter/app.cerebral';

/**
 * validate the block from trial reason
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateBlockFromTrialAction = ({ get, path }: ActionProps) => {
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
