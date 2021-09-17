import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { createCaseDeadlineAction } from '../actions/CaseDeadline//createCaseDeadlineAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCaseDeadlineAction } from '../actions/CaseDeadline/validateCaseDeadlineAction';

export const createCaseDeadlineSequence = [
  clearAlertsAction,
  startShowValidationAction,
  getComputedFormDateFactoryAction(null),
  validateCaseDeadlineAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      createCaseDeadlineAction,
      {
        success: [stopShowValidationAction, setAlertSuccessAction],
      },
      clearFormAction,
      clearScreenMetadataAction,
      clearModalAction,
      clearModalStateAction,
      refreshCaseAction,
      getCaseDeadlinesForCaseAction,
    ]),
  },
];
