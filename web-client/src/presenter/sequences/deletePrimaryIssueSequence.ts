import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deletePrimaryIssueAction } from '@web-client/presenter/actions/CaseWorksheet/deletePrimaryIssueAction';
import { setCaseWorksheetAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updatePrimaryIssueAction } from '@web-client/presenter/actions/CaseWorksheet/updatePrimaryIssueAction';

export const deletePrimaryIssueSequence = showProgressSequenceDecorator([
  deletePrimaryIssueAction,
  updatePrimaryIssueAction,
  setCaseWorksheetAction,
  clearModalStateAction,
]);
