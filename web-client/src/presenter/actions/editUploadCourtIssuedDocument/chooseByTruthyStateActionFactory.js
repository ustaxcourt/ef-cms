import { state } from 'cerebral';

/**
 * used to direct the user to the correct next page - either the case detail page
 * or the supporting document form if they indicated they have supporting documents
 *
 * @param {string} statePath the state path
 * @returns {*} returns action that takes the next action in the sequence's path
 */
export const chooseByTruthyStateActionFactory = statePath => ({
  get,
  path,
}) => {
  if (get(state[statePath])) {
    return path.yes();
  } else {
    return path.no();
  }
};
