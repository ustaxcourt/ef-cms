import { state } from 'cerebral';

/**
 * gets the first docket entry document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDocketViewerDocumentToDisplayAction = ({ get }) => {
  const documentId = get(state.documentId);
  let viewerDocumentToDisplay = null;

  if (!documentId) {
    viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  }

  if (viewerDocumentToDisplay) return { viewerDocumentToDisplay };

  const { docketEntries } = get(state.caseDetail);

  const entriesWithDocument = docketEntries.filter(
    entry => !entry.isMinuteEntry && entry.isFileAttached,
  );

  if (entriesWithDocument && entriesWithDocument.length) {
    if (documentId) {
      viewerDocumentToDisplay = entriesWithDocument.find(
        d => d.documentId === documentId,
      );
    } else {
      viewerDocumentToDisplay = entriesWithDocument[0];
    }
  }

  return {
    viewerDocumentToDisplay,
  };
};
