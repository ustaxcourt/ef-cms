import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { createCaseDeadlineAction } from '../actions/CaseDeadline//createCaseDeadlineAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateCaseDeadlineAction } from '../actions/CaseDeadline/validateCaseDeadlineAction';

export const createCaseDeadlineSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeFormDateAction,
  validateCaseDeadlineAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
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
      unsetWaitingForResponseAction,
    ],
  },
];
