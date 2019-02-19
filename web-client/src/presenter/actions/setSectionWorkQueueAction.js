import { state } from 'cerebral';

/**
 * sets the state.sectionWorkQueue to the props.sectionWorkQueue passed in.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.sectionWorkQueue
 * @param {Function} providers.props the cerebral props object used for getting the props.sectionWorkQueue
 */
export default ({ store, props }) => {
  store.set(state.sectionWorkQueue, props.sectionWorkItems);
};
