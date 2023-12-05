import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCaseDeadlineAction } from '../actions/CaseDeadline/updateCaseDeadlineAction';
import { validateCaseDeadlineAction } from '../actions/CaseDeadline/validateCaseDeadlineAction';

export const updateCaseDeadlineSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCaseDeadlineAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      updateCaseDeadlineAction,
      {
        success: [stopShowValidationAction],
      },
      clearFormAction,
      clearScreenMetadataAction,
      clearModalAction,
      clearModalStateAction,
      getCaseDeadlinesForCaseAction,
    ]),
  },
];
