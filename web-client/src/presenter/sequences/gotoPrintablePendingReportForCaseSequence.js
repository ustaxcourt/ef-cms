import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setupPropsForPrintablePendingReportAction } from '../actions/PendingItems/setupPropsForPrintablePendingReportAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintablePendingReportForCaseSequence = [
  setWaitingForResponseAction,
  getCaseAction,
  setCaseAction,
  setupPropsForPrintablePendingReportAction,
  generatePrintablePendingReportAction,
  setPdfPreviewUrlSequence,
  setTitleForGlobalReportAction,
  set(state.currentPage, 'SimplePdfPreviewPage'),
  unsetWaitingForResponseAction,
];
