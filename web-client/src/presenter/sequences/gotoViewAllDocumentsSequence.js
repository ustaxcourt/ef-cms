import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoViewAllDocumentsSequence = [
  setCurrentPageAction('ViewAllDocuments'),
];
