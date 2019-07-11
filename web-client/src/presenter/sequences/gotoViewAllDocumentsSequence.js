import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

export const gotoViewAllDocumentsSequence = [
  setCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  set(state.allDocumentsAccordion, ''),
  setCurrentPageAction('ViewAllDocuments'),
];
