import { state } from '@web-client/presenter/app.cerebral';

export const clearModalStateAction = ({ store }: ActionProps) => {
  store.set(state.modal, {});
};
