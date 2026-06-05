import { state } from '@web-client/presenter/app.cerebral';

export const removeAdditionalOrderTextAction = ({
  get,
  props,
  store,
}: ActionProps<{ index: number }>) => {
  const current: string[] = get(state.form.additionalOrderText) || [];
  const next = current.filter((_, i) => i !== props.index);
  store.set(state.form.additionalOrderText, next);
};
