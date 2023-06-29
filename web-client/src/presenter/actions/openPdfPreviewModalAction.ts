import { state } from '@web-client/presenter/app.cerebral';
/**
 * Sets state.modal.showModal to PDFPreviewModal
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const openPdfPreviewModalAction = ({ props, store }: ActionProps) => {
  store.set(state.previewPdfFile, props.file);
  store.set(state.modal.showModal, props.modalId);
};
