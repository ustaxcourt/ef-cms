import { getDefaultDocketViewerDocumentToDisplayAction } from '../../actions/getDefaultDocketViewerDocumentToDisplayAction';

import { getAction } from '../../actions/actionFactory';

const setViewerDocumentToDisplayAction = getAction(
  'setViewerDocumentToDisplayAction',
);

export const loadDefaultDocketViewerDocumentToDisplaySequence = [
  getDefaultDocketViewerDocumentToDisplayAction,
  setViewerDocumentToDisplayAction,
];
