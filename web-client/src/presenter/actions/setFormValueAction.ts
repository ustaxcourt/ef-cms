import { state } from '@web-client/presenter/app.cerebral';

export const setFormValueAction = ({
  props,
  store,
}: ActionProps<{
  allowEmptyString?: boolean;
  index?: number;
  key: string;
  value: any;
}>) => {
  const { allowEmptyString, index, key, value } = props;

  if ((!allowEmptyString && value === '') || value === null) {
    return store.unset(state.form[key]);
  }

  if (typeof index === 'number') {
    return store.set(state.form[key][index], value);
  }

  store.set(state.form[key], value);
};
