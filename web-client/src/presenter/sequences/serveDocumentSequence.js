import { clearModalAction } from '../actions/clearModalAction';
import { serveDocumentAction } from '../actions/serveDocumentAction';

export const serveDocumentSequence = [serveDocumentAction, clearModalAction];
