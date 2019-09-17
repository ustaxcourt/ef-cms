import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { state } from 'cerebral';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const gotoPrintableDocketRecordSequence = [
  setFormSubmittingAction,
  getCaseAction,
  setCaseAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  set(state.currentPage, 'PrintableDocketRecord'),
  unsetFormSubmittingAction,
];
