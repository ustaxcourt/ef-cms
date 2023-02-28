import { state } from 'cerebral';

/**
 * clears the state.pdfPreviewUrl which is used for displaying PDF rendering previews
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral function used to retrieve pdfPreviewUrl from state
 */
export const clearPdfPreviewUrlAction = ({ get, router }) => {
  const oldUrl = get(state.pdfPreviewUrl);
  router.revokeObjectURL(oldUrl);
};
