import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailSequence } from './navigateToCaseDetailSequence';

export const cancelAddDraftDocumentSequence = [
  getCaseAction,
  ...navigateToCaseDetailSequence,
];
