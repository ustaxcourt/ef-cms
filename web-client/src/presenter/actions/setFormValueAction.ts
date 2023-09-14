import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form to the props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setFormValueAction = ({ props, store }: ActionProps) => {
  if (props.value !== '' && props.value !== null) {
    store.set(state.form[props.key], props.value);
  } else {
    store.unset(state.form[props.key]);
  }
};
