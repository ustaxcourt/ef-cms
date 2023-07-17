import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCasePrimaryIssueInDBAction } from '../actions/CaseWorksheet/deleteCasePrimaryIssueInDBAction';
import { deleteCasePrimaryIssueInStateAction } from '../actions/CaseWorksheet/deleteCasePrimaryIssueInStateAction';
import { fetchUpdatedCasePrimaryIssueFromModalStateAction } from '../actions/CaseWorksheet/fetchUpdatedCasePrimaryIssueFromModalStateAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteCasePrimaryIssueSequence = showProgressSequenceDecorator([
  fetchUpdatedCasePrimaryIssueFromModalStateAction,
  deleteCasePrimaryIssueInStateAction,
  deleteCasePrimaryIssueInDBAction,
  clearModalStateAction,
]);
