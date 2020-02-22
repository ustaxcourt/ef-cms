import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';

export const goBackToDocumentDetailSequence = [
  setCurrentPageAction('DocumentDetail'),
  setDocumentDetailTabAction,
  navigateToDocumentDetailAction,
];
