import { state } from 'cerebral';

/**
 * resets the work item forward form
 * state.form is used throughout the app for storing html form values
 * props.workItemId is used for knowing which work item's forward form needs to be cleared.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 * @param {object} providers.props the cerebral props object containing workItemId
 */
export const clearForwardFormAction = ({ props, store }) => {
  store.set(state.form[props.workItemId], {});
  store.set(state.workItemMetadata, {});
};
