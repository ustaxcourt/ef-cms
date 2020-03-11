import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitEditIrsPractitionersModalAction } from '../actions/caseAssociation/submitEditIrsPractitionersModalAction';
import { validateEditIrsPractitionersAction } from '../actions/caseAssociation/validateEditIrsPractitionersAction';

export const submitEditIrsPractitionersModalSequence = [
  startShowValidationAction,
  validateEditIrsPractitionersAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      submitEditIrsPractitionersModalAction,
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
