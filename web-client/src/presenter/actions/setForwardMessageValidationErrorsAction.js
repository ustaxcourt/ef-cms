import { state } from 'cerebral';

/**
 * sets validation errors for the given props.workItemId on state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const setForwardMessageValidationErrorsAction = ({ props, store }) => {
  store.set(state.validationErrors[props.workItemId], props.errors);
};
