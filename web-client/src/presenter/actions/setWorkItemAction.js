import { state } from 'cerebral';

/**
 * sets the state.workItem based on the props.workItem passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.workItem
 * @param {Object} providers.props the cerebral props object used for getting the props.workItem
 */
export default ({ store, props }) => {
  store.set(state.workItem, props.workItem);
};
