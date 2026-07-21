import { state } from '@web-client/presenter/app.cerebral';

export const addAdditionalOrderTextAction = ({ get, store }: ActionProps) => {
  const current: string[] = get(state.form.additionalOrderText) || [];
  store.set(state.form.additionalOrderText, [...current, '']);
};
