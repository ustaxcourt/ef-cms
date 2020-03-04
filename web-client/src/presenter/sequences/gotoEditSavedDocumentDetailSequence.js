import { navigateToEditSavedDocumentDetailAction } from '../actions/caseDetailEdit/navigateToEditSavedDocumentDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';

export const gotoEditSavedDocumentDetailSequence = [
  setCurrentPageAction('DocumentDetail'),
  navigateToEditSavedDocumentDetailAction,
  setDocumentDetailTabAction,
];
