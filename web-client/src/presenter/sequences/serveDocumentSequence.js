import { clearModalAction } from '../actions/clearModalAction';
import { serveDocumentAction } from '../actions/serveDocumentAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

export const serveDocumentSequence = [
  serveDocumentAction,
  setAlertSuccessAction,
  clearModalAction,
];
