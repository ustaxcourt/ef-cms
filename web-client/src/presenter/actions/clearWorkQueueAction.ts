import { state } from '@web-client/presenter/app.cerebral';

/**
 *  resets the workQueue.
 *  state.workQueue is used for holding all the work items that exist in a work queue
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueue
 */
export const clearWorkQueueAction = ({ store }: ActionProps) => {
  store.set(state.workQueue, []);
};
