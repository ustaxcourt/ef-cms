import { state } from '@web-client/presenter/app.cerebral';

export const setFormValueAction = ({ props, store }: ActionProps) => {
  if (props.value !== '' && props.value !== null) {
    if (props.index !== null) {
      store.set(state.form[props.key][props.index], props.value);
    } else {
      store.set(state.form[props.key], props.value);
    }
  } else {
    store.unset(state.form[props.key]);
  }
};
