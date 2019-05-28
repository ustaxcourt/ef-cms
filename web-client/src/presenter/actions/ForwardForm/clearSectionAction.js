import { state } from 'cerebral';

/**
 * clear the state.form based on the props.workItemId.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.form
 * @param {Object} providers.props the cerebral props object used for getting the props.workItemId and value
 */
export const clearSectionAction = ({ store, props }) => {
  store.set(state.form[props.workItemId].section, '');
};
