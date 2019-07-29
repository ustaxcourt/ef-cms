import { state } from 'cerebral';

/**
 * sets the state.page which shows the docket record print preview
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.pdfPreviewUrl
 */
export const gotoPrintDocketRecordPreview = ({ store }) => {
  store.set(state.currentPage, 'CaseDetailInternalPrint');
};
