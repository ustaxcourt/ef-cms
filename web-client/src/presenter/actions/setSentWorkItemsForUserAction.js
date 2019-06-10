import { state } from 'cerebral';

/**
 * sets the state.workQueue.myQueue.outbox to the props.workItems passed in.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.workQueue.myQueue.outbox
 * @param {Function} providers.props the cerebral props object used for getting the props.workItems
 */
export const setSentWorkItemsForUserAction = ({ store, props }) => {
  store.set(state.workQueue.myQueue.outbox, props.workItems);
};
