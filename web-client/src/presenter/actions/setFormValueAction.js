import { state } from 'cerebral';

/**
 * sets the state.form to the pros.value passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setFormValueAction = ({ props, store }) => {
  if (props.value !== '') {
    store.set(state.form[props.key], props.value);
  } else {
    store.unset(state.form[props.key]);
  }
};
