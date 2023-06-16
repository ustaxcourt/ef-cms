import { state } from '@web-client/presenter/app.cerebral';

/**
 * unsets the pdfPreviewUrl state
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pdfPreviewUrl
 */
export const clearPdfPreviewUrlAction = ({ store }: ActionProps) => {
  store.unset(state.pdfPreviewUrl);
};
