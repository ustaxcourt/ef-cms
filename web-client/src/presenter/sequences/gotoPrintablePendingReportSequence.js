import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { set } from 'cerebral/factories';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintablePendingReportSequence = [
  setWaitingForResponseAction,
  generatePrintablePendingReportAction,
  setPdfPreviewUrlSequence,
  setTitleForGlobalReportAction,
  set(state.currentPage, 'SimplePdfPreviewPage'),
  unsetWaitingForResponseAction,
];
