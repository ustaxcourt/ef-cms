import { state } from 'cerebral';

/**
 * sets the state.form based on the props.workItemId/key/value passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.form
 * @param {Object} providers.props the cerebral props object used for getting the props.workItemId, key and value
 */
export const setForwardFormValueAction = ({ store, props }) => {
  store.set(state.form[props.workItemId][props.key], props.value);
};
