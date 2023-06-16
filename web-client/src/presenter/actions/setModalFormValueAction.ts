import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.form to the props.value passed in
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setModalFormValueAction = ({ get, props, store }: ActionProps) => {
  const modal = get(state.modal);
  if (!modal.form) {
    store.set(state.modal.form, { [props.key]: props.value });
  } else if (props.value !== '' && props.value !== null) {
    store.set(state.modal.form[props.key], props.value);
  } else {
    store.unset(state.modal.form[props.key]);
  }
};
