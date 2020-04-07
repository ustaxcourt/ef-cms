import { associatePrivatePractitionerWithCaseAction } from '../../actions/ManualAssociation/associatePrivatePractitionerWithCaseAction';
import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearFormAction } from '../../actions/clearFormAction';
import { clearModalAction } from '../../actions/clearModalAction';
import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { setAlertSuccessAction } from '../../actions/setAlertSuccessAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCasePropFromStateAction } from '../../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateAddPrivatePractitionerAction } from '../../actions/caseAssociation/validateAddPrivatePractitionerAction';

export const associatePrivatePractitionerWithCaseSequence = showProgressSequenceDecorator(
  [
    startShowValidationAction,
    validateAddPrivatePractitionerAction,
    {
      error: [setValidationErrorsAction],
      success: [
        clearAlertsAction,
        stopShowValidationAction,
        associatePrivatePractitionerWithCaseAction,
        {
          success: [
            setAlertSuccessAction,
            clearModalAction,
            clearModalStateAction,
            clearFormAction,
            setCasePropFromStateAction,
            getCaseAction,
            setCaseAction,
          ],
        },
      ],
    },
  ],
);
