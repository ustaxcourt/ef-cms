import { state } from 'cerebral';

/**
 * sets state.form for the key provided if the value is not an
 * empty string; unsets the state.form for the key if the value
 * is an empty string
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object
 * @returns {void}
 */
export const updateFormValueWithoutEmptyStringAction = ({ store, props }) => {
  if (props.value) {
    store.set(state.form[props.key], props.value);
  } else {
    store.unset(state.form[props.key]);
  }
};
