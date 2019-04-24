import { dismissCaseCaptionModalSequence } from './dismissCaseCaptionModalSequence';
import { getChangesSavedAlertSuccessAction } from '../actions/getChangesSavedAlertSuccessAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseCaptionPropFromStateAction } from '../actions/setCaseCaptionPropFromStateAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

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
