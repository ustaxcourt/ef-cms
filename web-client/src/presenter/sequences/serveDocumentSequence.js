import { clearModalAction } from '../actions/clearModalAction';
import { serveDocumentAction } from '../actions/serveDocumentAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';

export const serveDocumentSequence = [
  serveDocumentAction,
  {
    error: [setAlertErrorAction],
    success: [],
  },
  clearModalAction,
];
