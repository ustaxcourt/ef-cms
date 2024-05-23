import { state } from '@web-client/presenter/app.cerebral';

export const setPetitionFormValueAction = ({
  props,
  store,
}: ActionProps<{ index: number; key: string; value: any }>) => {
  const { index, key, value } = props;
  if (value !== null) {
    if (index || index === 0) {
      store.set(state.form[key][index], value);
    } else {
      store.set(state.form[key], value);
    }
  } else {
    store.unset(state.form[key]);
  }
};
