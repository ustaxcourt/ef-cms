import { state } from '@web-client/presenter/app.cerebral';

export const addFactOrReasonAction = ({ get, props, store }: ActionProps) => {
  const newIndex = get(state.form[props.key]).length;
  store.set(state.form[props.key][newIndex], '');
};
