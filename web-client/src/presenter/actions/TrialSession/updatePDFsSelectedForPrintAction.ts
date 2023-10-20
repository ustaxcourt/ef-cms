import { remove } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const updatePDFsSelectedForPrintAction = ({
  get,
  props,
  store,
}: ActionProps<{ key: string }>) => {
  const { selectedPdfs } = get(state.modal.form);

  if (selectedPdfs.includes(props.key)) {
    store.set(state.modal.form.selectedPdfs, remove(selectedPdfs, props.key));
  } else {
    store.set(state.modal.form.selectedPdfs, [...selectedPdfs, props.key]);
  }
};
