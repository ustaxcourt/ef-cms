import { state } from '@web-client/presenter/app.cerebral';

export const setReprintPaperServicePdfsModalFormAction = ({ store }) => {
  // todo: should be modal.form
  store.set(state.form, { selectedPdfs: [] });
};
