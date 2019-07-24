import { state } from 'cerebral';

/**
 * sets the state.form based on the props.workItemId and value passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.form
 * @param {object} providers.props the cerebral props object used for getting the props.workItemId and value
 */
export const setSectionAction = ({ props, store }) => {
  store.set(state.form[props.workItemId].section, props.value);
};
