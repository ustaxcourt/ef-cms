import { state } from '@web-client/presenter/app.cerebral';

export const setReprintPaperServicePdfsModalFormAction = ({
  store,
}: ActionProps) => {
  store.set(state.modal.form, { selectedPdf: '' });
};
