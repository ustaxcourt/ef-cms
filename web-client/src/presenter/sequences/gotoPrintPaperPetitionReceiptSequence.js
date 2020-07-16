import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setRedirectUrlFromNextPageAction } from '../actions/setRedirectUrlFromNextPageAction';

export const gotoPrintPaperPetitionReceiptSequence = [
  setRedirectUrlFromNextPageAction,
  setCurrentPageAction('PrintPaperPetitionReceipt'),
];
