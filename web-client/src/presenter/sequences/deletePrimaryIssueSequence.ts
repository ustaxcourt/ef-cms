import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deletePrimaryIssueAction } from '@web-client/presenter/actions/CaseWorksheet/deletePrimaryIssueAction';
import { setCaseWorksheetAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deletePrimaryIssueSequence = showProgressSequenceDecorator([
  deletePrimaryIssueAction,
  setCaseWorksheetAction,
  clearModalStateAction,
]);
