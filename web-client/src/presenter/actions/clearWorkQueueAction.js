import { state } from 'cerebral';

/**
 *  resets the workQueue.
 *  state.workQueue is used for holding all the work items that exist in a work queue
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting workQueue
 */
export default ({ store }) => {
  store.set(state.workQueue, []);
};
