import { state } from 'cerebral';

/**
 * sets the state.sectionWorkQueue to the props.sectionWorkQueue passed in.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.sectionWorkQueue
 * @param {Function} providers.props the cerebral props object used for getting the props.sectionWorkQueue
 */
export const setSectionWorkQueueAction = ({ props, store }) => {
  store.set(state.sectionWorkQueue, props.sectionWorkItems);
};
