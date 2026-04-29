import { state } from '@web-client/presenter/app.cerebral';

export const clearModalFormAction = ({ store }: ActionProps) => {
  store.set(state.modal.form, {});
};
