import { state } from 'cerebral';

/**
 * sets the state.workItem based on the props.workItem passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 * @param {object} providers.props the cerebral props object used for getting the props.workItem
 */
export const setWorkItemAction = ({ props, store }) => {
  store.set(state.workItem, props.workItem);
};
