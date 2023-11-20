import { state } from '@web-client/presenter/app.cerebral';

export const updatePDFsSelectedForPrintAction = ({
  props,
  store,
}: ActionProps<{ key: string }>) => {
  store.set(state.modal.form.selectedPdf, props.key);
};
