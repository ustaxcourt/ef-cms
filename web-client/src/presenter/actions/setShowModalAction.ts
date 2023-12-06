import { state } from '@web-client/presenter/app.cerebral';

export const setShowModalAction = ({
  props,
  store,
}: ActionProps<{ showModal: string }>) => {
  store.set(state.modal.showModal, props.showModal);
};
