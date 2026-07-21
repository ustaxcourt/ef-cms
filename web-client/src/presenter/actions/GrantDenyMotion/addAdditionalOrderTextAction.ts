import { state } from '@web-client/presenter/app.cerebral';

export const addAdditionalOrderTextAction = ({ get, store }: ActionProps) => {
  const current: string[] = get(state.form.additionalOrderTextArray) || [];
  store.set(state.form.additionalOrderTextArray, [...current, '']);
};
