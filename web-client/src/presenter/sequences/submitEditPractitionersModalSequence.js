import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitEditPractitionersModalAction } from '../actions/caseAssociation/submitEditPractitionersModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateEditPractitionersAction } from '../actions/caseAssociation/validateEditPractitionersAction';

export const submitEditPractitionersModalSequence = [
  startShowValidationAction,
  validateEditPractitionersAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      clearAlertsAction,
      stopShowValidationAction,
      submitEditPractitionersModalAction,
      {
        success: [
          setAlertSuccessAction,
          clearModalAction,
          clearFormAction,
          setCasePropFromStateAction,
          getCaseAction,
          setCaseAction,
          unsetWaitingForResponseAction,
        ],
      },
    ],
  },
];
