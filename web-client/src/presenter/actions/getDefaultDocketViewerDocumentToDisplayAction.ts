import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getDocketEntriesByFilter } from '@shared/business/utilities/getDocketEntriesByFilter';
import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the first docket entry document from the current case detail to set as the default viewerDocumentToDisplay
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDocketViewerDocumentToDisplayAction = ({
  get,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const docketRecordFilter = get(state.sessionMetadata.docketRecordFilter);
  const docketEntryId = get(state.docketEntryId);
  const entriesWithDocument = docketEntries.filter(
    entry => !DocketEntry.isMinuteEntry(entry) && entry.isFileAttached,
  );

  const docketEntriesByFilter = getDocketEntriesByFilter(applicationContext, {
    docketEntries: entriesWithDocument,
    docketRecordFilter,
  });

  const viewerDocumentToDisplayInState = get(state.viewerDocumentToDisplay);

  let viewerDocumentToDisplay;

  if (docketEntriesByFilter?.length) {
    if (docketEntryId) {
      const foundDocketEntry = docketEntriesByFilter.find(
        d => d.docketEntryId === docketEntryId,
      );

      if (foundDocketEntry) {
        viewerDocumentToDisplay = foundDocketEntry;
      } else {
        viewerDocumentToDisplay =
          viewerDocumentToDisplayInState || docketEntriesByFilter[0];
      }
    } else if (viewerDocumentToDisplayInState) {
      const stateDocStillVisible = docketEntriesByFilter.find(
        d => d.docketEntryId === viewerDocumentToDisplayInState.docketEntryId,
      );
      viewerDocumentToDisplay =
        stateDocStillVisible || docketEntriesByFilter[0];
    } else {
      viewerDocumentToDisplay = docketEntriesByFilter[0];
    }
  }

  return {
    viewerDocumentToDisplay,
  };
};
