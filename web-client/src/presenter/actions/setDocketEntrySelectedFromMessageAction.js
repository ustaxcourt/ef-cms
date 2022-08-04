import { state } from 'cerebral';

/**
 * sets the viewerDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setDocketEntrySelectedFromMessageAction = async ({
  get,
  props,
}) => {
  const caseDetail = get(state.caseDetail);
  const { docketEntryId, parentMessageId } = props;

  const messageViewerDocumentToDisplay = caseDetail.docketEntries.find(
    entries => entries.docketEntryId === docketEntryId,
  );
  // TODO: figure out why docketEntryId is correct here but we still go back to the wrong document
  // messageViewerDocumentToDisplay.documentId = docketEntryId;
  console.log('setDocketEntrySelectedFromMessageAction', docketEntryId);

  return { messageViewerDocumentToDisplay, mostRecentMessage: parentMessageId };
};
