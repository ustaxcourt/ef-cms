import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitEditPractitionersModalAction } from '../actions/caseAssociation/submitEditPractitionersModalAction';
import { validateEditPractitionersAction } from '../actions/caseAssociation/validateEditPractitionersAction';

export const submitEditPractitionersModalSequence = [
  startShowValidationAction,
  validateEditPractitionersAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
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
        ],
      },
    ]),
  },
];
