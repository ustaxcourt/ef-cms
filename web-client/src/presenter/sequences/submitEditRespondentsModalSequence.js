import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitEditRespondentsModalAction } from '../actions/caseAssociation/submitEditRespondentsModalAction';
import { validateEditRespondentsAction } from '../actions/caseAssociation/validateEditRespondentsAction';

export const submitEditRespondentsModalSequence = [
  startShowValidationAction,
  validateEditRespondentsAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
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
    ]),
  },
];
