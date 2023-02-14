import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const setMessageDetailViewerDocumentToDisplaySequence =
  showProgressSequenceDecorator([
    getMostRecentMessageInThreadAction,
    setMessageDetailViewerDocumentToDisplayAction,
  ]);
