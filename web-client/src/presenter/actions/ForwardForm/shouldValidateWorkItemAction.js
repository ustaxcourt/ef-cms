import { state } from 'cerebral';

/**
 * action to decide if validation should be run.
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path object used for invoking the next path
 * @param {Function} providers.get the cerebral get helper function
 * @returns {object} the path to take.
 */
export const shouldValidateWorkItemAction = ({ path, get }) => {
  if (get(state.workItemMetadata.showValidation)) return path.validate();
  return path.ignore();
};
