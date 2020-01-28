import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitEditRespondentsModalAction } from '../actions/caseAssociation/submitEditRespondentsModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateEditRespondentsAction } from '../actions/caseAssociation/validateEditRespondentsAction';

export const submitEditRespondentsModalSequence = [
  startShowValidationAction,
  validateEditRespondentsAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      submitEditRespondentsModalAction,
      {
        success: [
          setAlertSuccessAction,
          clearModalAction,
          clearFormAction,
          setCasePropFromStateAction,
          getCaseAction,
          setCaseAction,
        ],
      },
      unsetWaitingForResponseAction,
    ],
  },
];
