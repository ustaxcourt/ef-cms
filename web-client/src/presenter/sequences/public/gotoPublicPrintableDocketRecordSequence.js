import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setBaseUrlAction } from '../../actions/setBaseUrlAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../../actions/unsetWaitingForResponseAction';

export const gotoPublicPrintableDocketRecordSequence = [
  setWaitingForResponseAction,
  getPublicCaseAction,
  setCaseAction,
  setBaseUrlAction,
  generatePublicDocketRecordPdfUrlAction,
  setPdfPreviewUrlSequence,
  setCurrentPageAction('PublicPrintableDocketRecord'),
  unsetWaitingForResponseAction,
];
