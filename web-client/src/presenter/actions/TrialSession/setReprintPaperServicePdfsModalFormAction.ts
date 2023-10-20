import { state } from '@web-client/presenter/app.cerebral';

export const setReprintPaperServicePdfsModalFormAction = ({ store }) => {
  store.set(state.modal.form, { selectedPdfs: [] });
};
