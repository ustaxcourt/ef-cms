import { state } from 'cerebral';

/**
 * Clears the form for the specific workItemId.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 * @param {object} providers.workItemId the cerebral props that contain the workItemId that should be cleared
 */
export const clearCompleteFormAction = ({ store, props }) => {
  store.set(state.completeForm[props.workItemId], {});
};
