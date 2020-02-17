import { associateRespondentWithCaseAction } from '../../actions/ManualAssociation/associateRespondentWithCaseAction';
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
import { validateAddRespondentAction } from '../../actions/caseAssociation/validateAddRespondentAction';

export const associateRespondentWithCaseSequence = showProgressSequenceDecorator(
  [
    startShowValidationAction,
    validateAddRespondentAction,
    {
      error: [setValidationErrorsAction],
      success: [
        clearAlertsAction,
        stopShowValidationAction,
        associateRespondentWithCaseAction,
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
