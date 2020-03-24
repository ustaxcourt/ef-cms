import { state } from 'cerebral';

/**
 * Clears the form for the specific workItemId.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.workItemId the cerebral props
 */
export const clearCompleteFormAction = ({ props, store }) => {
  store.set(state.completeForm[props.workItemId], {});
};
