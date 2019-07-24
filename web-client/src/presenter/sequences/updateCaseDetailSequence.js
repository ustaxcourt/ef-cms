import { dismissCaseCaptionModalSequence } from './dismissCaseCaptionModalSequence';
import { getChangesSavedAlertSuccessAction } from '../actions/getChangesSavedAlertSuccessAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseCaptionPropFromStateAction } from '../actions/setCaseCaptionPropFromStateAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const updateCaseDetailSequence = [
  setFormSubmittingAction,
  setCaseCaptionPropFromStateAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      updateCaseAction,
      setCaseAction,
      getChangesSavedAlertSuccessAction,
      setAlertSuccessAction,
    ],
  },
  ...dismissCaseCaptionModalSequence,
  unsetFormSubmittingAction,
];
