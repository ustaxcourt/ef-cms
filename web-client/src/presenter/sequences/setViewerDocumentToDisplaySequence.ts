import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const setViewerDocumentToDisplaySequence = showProgressSequenceDecorator(
  [setViewerDocumentToDisplayAction],
);
