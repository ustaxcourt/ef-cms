import { state } from 'cerebral';

/**
 * sets the state.alertError which is used for displaying the red alerts at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.alertError
 * @param {object} providers.store the cerebral store used for setting the state.alertError
 */
export const setPdfPreviewUrlAction = ({ get, props, store }) => {
  const previousUrl = get(state.pdfPreviewUrl);
  if (previousUrl) URL.revokeObjectURL(previousUrl); // cleanup
  store.set(state.pdfPreviewUrl, props.blobUrl);
};
