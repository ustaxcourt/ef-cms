import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets up props and state for the appropriate docket entry
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setDocketEntrySelectedFromMessageAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const { docketEntryId } = props;

  const messageViewerDocumentToDisplay = caseDetail.docketEntries.find(
    entries => entries.docketEntryId === docketEntryId,
  );
  messageViewerDocumentToDisplay.documentId = docketEntryId;

  store.set(
    state.messageViewerDocumentToDisplay,
    messageViewerDocumentToDisplay,
  );
  store.set(state.documentId, docketEntryId);
};
