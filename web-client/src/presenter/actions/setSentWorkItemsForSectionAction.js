import { state } from 'cerebral';

/**
 * sets the state.workQueue.section.outbox to the props.workItems passed in.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.workQueue.section.outbox
 * @param {Function} providers.props the cerebral props object used for getting the props.workItems
 */
export const setSentWorkItemsForSectionAction = ({ store, props }) => {
  store.set(state.workQueue.section.outbox, props.workItems);
};
