import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { hasPaperAction } from '../actions/hasPaperAction';
import { navigateToPrintPaperServiceAction } from '../actions/navigateToPrintPaperServiceAction';
import { servePaperFiledDocumentAction } from '../actions/DocketEntry/servePaperFiledDocumentAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToDisplayFromDocumentIdAction } from '../actions/setDocumentToDisplayFromDocumentIdAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const servePaperFiledDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  generateTitleAction,
  clearAlertsAction,
  getDocketNumbersForConsolidatedServiceAction,
  servePaperFiledDocumentAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
  hasPaperAction,
  {
    electronic: [setDocumentToDisplayFromDocumentIdAction],
    paper: [setPdfPreviewUrlSequence, navigateToPrintPaperServiceAction],
  },
]);
