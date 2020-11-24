import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

import { getAction } from '../actions/actionFactory';

const setViewerDocumentToDisplayAction = getAction(
  'setViewerDocumentToDisplayAction',
);

export const setViewerDocumentToDisplaySequence = showProgressSequenceDecorator(
  [setViewerDocumentToDisplayAction],
);
