import { state } from 'cerebral';
/**
 * Sets state.showModal to PDFPreviewModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const openPdfPreviewModalAction = ({ store }) => {
  store.set(state.showModal, 'PDFPreviewModal');
};
