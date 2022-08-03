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

  console.log(messageViewerDocumentToDisplay, '-----');

  return { messageViewerDocumentToDisplay, mostRecentMessage: parentMessageId };
};
