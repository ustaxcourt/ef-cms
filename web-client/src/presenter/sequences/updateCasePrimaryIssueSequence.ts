import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { fetchUpdatedCasePrimaryIssueFromModalStateAction } from '../actions/TrialSessionWorkingCopy/fetchUpdatedCasePrimaryIssueFromModalStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCasePrimaryIssueInDbAction } from '../actions/TrialSession/updateCaseWithUpdatedPrimaryIssueAction';
import { updateCasePrimaryIssueInStatection } from '../actions/TrialSessionWorkingCopy/updateCasePrimaryIssueAction';
import { validatePrimaryIssueAction } from '../actions/validatePrimaryIssueAction';

export const updateCasePrimaryIssueSequence = [
  startShowValidationAction,
  validatePrimaryIssueAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      fetchUpdatedCasePrimaryIssueFromModalStateAction,
      updateCasePrimaryIssueInStatection,
      updateCasePrimaryIssueInDbAction,
      clearModalStateAction,
    ]),
  },
];
