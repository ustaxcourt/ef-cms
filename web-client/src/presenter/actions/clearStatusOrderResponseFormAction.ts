import { state } from '@web-client/presenter/app.cerebral';

export const clearStatusOrderResponseFormAction = ({
  get,
  store,
}: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  if (!documentToEdit) {
    store.set(state.form, {});
  }
};
