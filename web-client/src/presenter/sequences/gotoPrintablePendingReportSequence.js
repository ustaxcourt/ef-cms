import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintablePendingReportSequence = [
  setWaitingForResponseAction,
  getCaseAction,
  setCaseAction,
  setBaseUrlAction,
  generatePrintablePendingReportAction,
  setPdfPreviewUrlSequence,
  set(state.currentPage, 'PrintableDocketRecord'),
  unsetWaitingForResponseAction,
];
