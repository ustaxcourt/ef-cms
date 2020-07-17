import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { servePaperFiledDocumentAction } from '../actions/servePaperFiledDocumentAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const servePaperFiledDocumentSequence = showProgressSequenceDecorator([
  generateTitleAction,
  clearAlertsAction,
  servePaperFiledDocumentAction,
]);
