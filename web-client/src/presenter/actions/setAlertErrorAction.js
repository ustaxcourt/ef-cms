import { state } from 'cerebral';

/**
 * sets the state.alertError which is used for displaying the red alerts at the top of the page.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object containing the props.alertError
 * @param {Object} providers.store the cerebral store used for setting the state.alertError
 */
export default ({ props, store }) => {
  store.set(state.alertError, props.alertError);
};
