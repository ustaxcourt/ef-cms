import { state } from 'cerebral';

/**
 * unsets the pdfPreviewUrl state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pdfPreviewUrl
 */
export const clearPdfPreviewUrlAction = ({ store }) => {
  store.unset(state.pdfPreviewUrl);
};
