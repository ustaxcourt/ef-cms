import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintableDocketRecordSequence = [
  setWaitingForResponseAction,
  getCaseAction,
  setCaseAction,
  generateDocketRecordPdfUrlAction,
  setPdfPreviewUrlSequence,
  set(state.currentPage, 'PrintableDocketRecord'),
  unsetWaitingForResponseAction,
];
