import { state } from 'cerebral';

/**
 * sets the viewerDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setSelectedDocketEntryAction = async ({ get }) => {
  const caseDetail = get(state.caseDetail);

  const viewerDocumentToDisplay = caseDetail.docketEntries.find(
    entries => entries.docketEntryId === get(state.docketEntryId),
  );

  console.log(viewerDocumentToDisplay, '-----');

  return { viewerDocumentToDisplay };
};
