import { generateCaseConfirmationPdfUrlAction } from '../actions/CaseConfirmation/generateCaseConfirmationPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintableCaseConfirmationSequence = [
  setWaitingForResponseAction,
  getCaseAction,
  setCaseAction,
  setBaseUrlAction,
  generateCaseConfirmationPdfUrlAction,
  set(state.currentPage, 'PrintableDocketRecord'),
  unsetWaitingForResponseAction,
];
