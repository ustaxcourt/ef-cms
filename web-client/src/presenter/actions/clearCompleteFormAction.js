import { state } from 'cerebral';

/**
 * Clears the form for the specific workItemId.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 * @param {Object} providers.workItemId the cerebral props that contain the workItemId that should be cleared
 */
export default ({ store, props }) => {
  store.set(state.completeForm[props.workItemId], {});
};
