import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isGlobalReportAction } from '../actions/PendingItems/isGlobalReportAction';
import { navigateToPdfPreviewAction } from '../actions/navigateToPdfPreviewAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setupPropsForPrintablePendingReportAction } from '../actions/PendingItems/setupPropsForPrintablePendingReportAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintablePendingReportSequence = [
  setWaitingForResponseAction,
  isGlobalReportAction,
  {
    no: [
      getCaseAction,
      setCaseAction,
      setBaseUrlAction,
      setupPropsForPrintablePendingReportAction,
    ],
    yes: [],
  },
  generatePrintablePendingReportAction,
  setPdfPreviewUrlSequence,
  isGlobalReportAction,
  {
    no: [set(state.currentPage, 'PrintableDocketRecord')],
    yes: [setTitleForGlobalReportAction, navigateToPdfPreviewAction],
  },
  unsetWaitingForResponseAction,
];
