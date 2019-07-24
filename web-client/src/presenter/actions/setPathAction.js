import { state } from 'cerebral';

/**
 * sets the state.path based on the props.path passed in
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object used for getting the props.path
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const setPathAction = ({ props, store }) => {
  if (props.path) {
    store.set(state.path, props.path);
  }
};
