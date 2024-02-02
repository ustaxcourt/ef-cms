import { state } from '@web-client/presenter/app.cerebral';

export const openInvalidFilesModalAction = ({ props, store }: ActionProps) => {
  store.set(state.invalidFiles, props.invalidFiles);
  store.set(state.modal.showModal, props.modalId);
};
