import { clearAlertsAction } from '../actions/clearAlertsAction';
import { expireSaveSuccessAction } from '../actions/expireSaveSuccessAction';
import { generateCaseConfirmationPdfAction } from '../actions/CaseConfirmation/generateCaseConfirmationPdfAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { navigateToPrintableCaseConfirmationSequence } from './navigateToPrintableCaseConfirmationSequence';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setSaveSuccessAction } from '../actions/setSaveSuccessAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { shouldNavigateToConfirmationAction } from '../actions/CaseConfirmation/shouldNavigateToConfirmationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const submitCaseDetailEditSaveSequence = [
  setWaitingForResponseAction,
  clearAlertsAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      updateCaseAction,
      generateCaseConfirmationPdfAction,
      setCaseAction,
      setSaveSuccessAction,
      expireSaveSuccessAction,
      setDocketNumberPropAction,
      shouldNavigateToConfirmationAction,
      {
        ignore: [],
        proceed: [navigateToPrintableCaseConfirmationSequence],
      },
    ],
  },
  unsetWaitingForResponseAction,
];
