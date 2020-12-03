import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const setViewerDocumentToDisplaySequence = showProgressSequenceDecorator(
  [setViewerDocumentToDisplayAction],
);
