import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
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
  //TODO this also needs logic to serve on multiple cases
  servePaperFiledDocumentAction,
  // save for later and serve doesn't go through the
  // interactor that we made changes to
  // maybe saw modal but didn't add to all cases
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
  hasPaperAction,
  {
    electronic: [setDocumentToDisplayFromDocumentIdAction],
    paper: [setPdfPreviewUrlSequence, navigateToPrintPaperServiceAction],
  },
]);
