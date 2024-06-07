import { state } from '@web-client/presenter/app.cerebral';

export const clearModalAction = ({ store }: ActionProps) => {
  store.unset(state.modal.showModal);
};
