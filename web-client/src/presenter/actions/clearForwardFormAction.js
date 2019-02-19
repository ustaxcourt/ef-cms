import { state } from 'cerebral';

/**
 * resets the work item forward form
 * state.form is used throughout the app for storing html form values
 * props.workItemId is used for knowing which work item's forward form needs to be cleared.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing the form
 * @param {Object} providers.props the cerebral props object containing workItemId
 */
export default ({ store, props }) => {
  store.set(state.form[props.workItemId], {});
};
