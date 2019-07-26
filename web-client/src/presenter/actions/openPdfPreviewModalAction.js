import { state } from 'cerebral';
/**
 * Sets state.showModal to PDFPreviewModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const openPdfPreviewModalAction = ({ props, store }) => {
  store.set(state.previewPdfFile, props.file);
  store.set(state.showModal, 'PDFPreviewModal');
};
