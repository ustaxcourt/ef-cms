import { remove } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const updatePDFsSelectedForPrintSequence = [
  ({ get, props, store }) => {
    const { selectedPdfs } = get(state.form);

    if (selectedPdfs.includes(props.key)) {
      store.set(state.form.selectedPdfs, remove(selectedPdfs, props.key));
    } else {
      store.set(state.form.selectedPdfs, [...selectedPdfs, props.key]);
    }
  },
];
