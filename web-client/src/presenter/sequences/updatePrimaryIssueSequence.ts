import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseWorksheetAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updatePrimaryIssueAction } from '../actions/CaseWorksheet/updatePrimaryIssueAction';
import { validatePrimaryIssueAction } from '../actions/validatePrimaryIssueAction';

export const updatePrimaryIssueSequence = [
  startShowValidationAction,
  validatePrimaryIssueAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      updatePrimaryIssueAction,
      setCaseWorksheetAction,
      clearModalStateAction,
    ]),
  },
];
