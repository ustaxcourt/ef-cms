import { navigateToEditSavedDocumentDetailAction } from '../actions/caseDetailEdit/navigateToEditSavedDocumentDetailAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';

export const navigateToEditSavedDocumentDetailSequence = [
  navigateToEditSavedDocumentDetailAction,
  setDocumentDetailTabAction,
];
