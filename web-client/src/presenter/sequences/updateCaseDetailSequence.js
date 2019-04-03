import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';
import { getChangesSavedAlertSuccessAction } from '../actions/getChangesSavedAlertSuccessAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseCaptionPropFromStateAction } from '../actions/setCaseCaptionPropFromStateAction';
import { dismissCaseCaptionModalSequence } from './dismissCaseCaptionModalSequence';

export const updateCaseDetailSequence = [
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
];
