import { state } from '@web-client/presenter/app.cerebral';

export const setFormValueAction = ({
  props,
  store,
}: ActionProps<{
  allowEmptyString?: boolean;
  index?: number;
  root?: string;
  key: string;
  value: any;
}>) => {
  const { allowEmptyString, index, key, root, value } = props;
  const stateRoot = root || 'form';

  if ((!allowEmptyString && value === '') || value === null) {
    return store.unset(state[stateRoot][key]);
  }

  if (typeof index === 'number') {
    return store.set(state[stateRoot][key][index], value);
  }

  store.set(state[stateRoot][key], value);
};
