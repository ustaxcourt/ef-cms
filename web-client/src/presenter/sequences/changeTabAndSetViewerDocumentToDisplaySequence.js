import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';

import { getAction } from '../actions/actionFactory';

const setViewerDocumentToDisplayAction = getAction(
  'setViewerDocumentToDisplayAction',
);

export const changeTabAndSetViewerDocumentToDisplaySequence = [
  setDefaultCaseDetailTabAction,
  setIsPrimaryTabAction,
  setViewerDocumentToDisplayAction,
];
