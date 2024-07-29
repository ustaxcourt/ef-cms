import { state } from '@web-client/presenter/app.cerebral';

export const setFormValueAction = ({
  props,
  store,
}: ActionProps<{ index?: number; key: string; value: any }>) => {
  const { index, key, value } = props;
  if (value === '' || value === null) return store.unset(state.form[key]);

  if (typeof index === 'number')
    return store.set(state.form[key][index], value);

  store.set(state.form[key], value);
};
