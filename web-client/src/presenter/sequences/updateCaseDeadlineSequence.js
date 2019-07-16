import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { updateCaseDeadlineAction } from '../actions/CaseDeadline/updateCaseDeadlineAction';
import { validateCaseDeadlineAction } from '../actions/CaseDeadline/validateCaseDeadlineAction';

export const updateCaseDeadlineSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeFormDateAction,
  validateCaseDeadlineAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setFormSubmittingAction,
      updateCaseDeadlineAction,
      {
        success: [stopShowValidationAction],
      },
      clearFormAction,
      clearScreenMetadataAction,
      clearModalAction,
      clearModalStateAction,
      refreshCaseAction,
      getCaseDeadlinesForCaseAction,
      unsetFormSubmittingAction,
    ],
  },
];
