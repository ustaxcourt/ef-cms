import { state } from 'cerebral';

/**
 * sets the state.form based on the props.workItemId/key/value passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.form
 * @param {object} providers.props the cerebral props object used for getting the props.workItemId, key and value
 */
export const setForwardFormValueAction = ({ props, store }) => {
  store.set(state.form[props.workItemId][props.key], props.value);
};
