import { dismissCaseCaptionModalSequence } from './dismissCaseCaptionModalSequence';
import { getChangesSavedAlertSuccessAction } from '../actions/getChangesSavedAlertSuccessAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseCaptionPropFromStateAction } from '../actions/setCaseCaptionPropFromStateAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const updateCaseDetailSequence = [
  setWaitingForResponseAction,
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
  unsetWaitingForResponseAction,
];
