import { state } from '@web-client/presenter/app.cerebral';

export const updatePDFsSelectedForPrintAction = ({
  get,
  props,
  store,
}: ActionProps<{ key: string }>) => {
  const selectedPdfs: string[] = get(state.modal.form.selectedPdfs);

  if (selectedPdfs.includes(props.key)) {
    const index = selectedPdfs.findIndex(
      selectedpdf => selectedpdf === props.key,
    );
    selectedPdfs.splice(index, 1);
    store.set(state.modal.form.selectedPdfs, selectedPdfs);
  } else {
    store.set(state.modal.form.selectedPdfs, [...selectedPdfs, props.key]);
  }
};
