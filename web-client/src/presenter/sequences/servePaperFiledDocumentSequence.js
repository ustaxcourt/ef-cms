import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { servePaperFiledDocumentAction } from '../actions/DocketEntry/servePaperFiledDocumentAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const servePaperFiledDocumentSequence = [
  clearModalAction,
  generateTitleAction,
  clearAlertsAction,
  setWaitingForResponseAction,
  getDocketNumbersForConsolidatedServiceAction,
  servePaperFiledDocumentAction,
];
