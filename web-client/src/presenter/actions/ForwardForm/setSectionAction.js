import { state } from 'cerebral';

/**
 * sets the state.form based on the props.workItemId and value passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.form
 * @param {Object} providers.props the cerebral props object used for getting the props.workItemId and value
 */
export const setSectionAction = ({ store, props }) => {
  store.set(state.form[props.workItemId].section, props.value);
};
