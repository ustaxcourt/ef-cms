import { state } from 'cerebral';

/**
 * gets the first docket entry document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDocketViewerDocumentToDisplayAction = ({ get }) => {
  const { docketEntries } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const entriesWithDocument = docketEntries.filter(
    entry => !entry.isMinuteEntry && entry.isFileAttached,
  );
  const viewerDocumentToDisplayInState = get(state.viewerDocumentToDisplay);

  let viewerDocumentToDisplay;

  if (entriesWithDocument && entriesWithDocument.length) {
    viewerDocumentToDisplay = entriesWithDocument[0];
    const foundDocketEnry = entriesWithDocument.find(
      d => d.docketEntryId === docketEntryId,
    );
    if (!docketEntryId && viewerDocumentToDisplayInState) {
      viewerDocumentToDisplay = viewerDocumentToDisplayInState;
    } else if (docketEntryId && foundDocketEnry) {
      viewerDocumentToDisplay = foundDocketEnry;
    }
  }

  return {
    viewerDocumentToDisplay,
  };
};
