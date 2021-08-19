import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const setMessageDetailViewerDocumentToDisplaySequence =
  showProgressSequenceDecorator([
    getMostRecentMessageInThreadAction,
    setMessageDetailViewerDocumentToDisplayAction,
  ]);
