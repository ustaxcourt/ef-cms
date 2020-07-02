import { state } from 'cerebral';
/**
 * gets the first docket entry document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDocketViewerDocumentToDisplayAction = ({ get }) => {
  let viewerDocumentToDisplay = null;
  const { formattedDocketEntries } = get(state.formattedCaseDetail);

  const entriesWithDocument = formattedDocketEntries.filter(
    entry => entry.hasDocument,
  );

  if (entriesWithDocument && entriesWithDocument.length) {
    viewerDocumentToDisplay = entriesWithDocument[0];
  }

  return {
    viewerDocumentToDisplay,
  };
};
