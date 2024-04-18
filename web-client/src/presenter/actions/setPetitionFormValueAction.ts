import { state } from '@web-client/presenter/app.cerebral';

export const setPetitionFormValueAction = ({ props, store }: ActionProps) => {
  if (props.value !== null) {
    if (props.index || props.index === 0) {
      store.set(state.form[props.key][props.index], props.value);
    } else {
      store.set(state.form[props.key], props.value);
    }
  } else {
    store.unset(state.form[props.key]);
  }
};
