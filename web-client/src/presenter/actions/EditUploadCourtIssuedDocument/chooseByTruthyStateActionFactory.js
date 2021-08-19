import { state } from 'cerebral';

/**
 * used to choose the next path based off whether the path stated in the factory exists and is truthy
 *
 * @param {string} statePath the state path
 * @returns {Function} returns action that takes the next action in the sequence's path
 */
export const chooseByTruthyStateActionFactory =
  statePath =>
  ({ get, path }) => {
    if (get(state[statePath])) {
      return path.yes();
    } else {
      return path.no();
    }
  };
