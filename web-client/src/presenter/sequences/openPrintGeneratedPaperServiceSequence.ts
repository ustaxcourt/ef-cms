import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';
import { state } from '@web-client/presenter/app.cerebral';

export const openPrintGeneratedPaperServiceSequence = [
  ({ store }) => {
    store.set(state.form, { selectedPdfs: [] });
  },
  setShowModalFactoryAction('PrintPreviouslyGeneratedPaperServiceModal'),
];
