import { associateIrsPractitionerWithCaseAction } from '../../actions/ManualAssociation/associateIrsPractitionerWithCaseAction';
import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearFormAction } from '../../actions/clearFormAction';
import { clearModalAction } from '../../actions/clearModalAction';
import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { getPendingEmailsOnCaseAction } from '../../actions/getPendingEmailsOnCaseAction';
import { setAlertSuccessAction } from '../../actions/setAlertSuccessAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCasePropFromStateAction } from '../../actions/setCasePropFromStateAction';
import { setPendingEmailsOnCaseAction } from '../../actions/setPendingEmailsOnCaseAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateAddIrsPractitionerAction } from '../../actions/caseAssociation/validateAddIrsPractitionerAction';

export const associateIrsPractitionerWithCaseSequence =
  showProgressSequenceDecorator([
    startShowValidationAction,
    validateAddIrsPractitionerAction,
    {
      error: [setValidationErrorsAction],
      success: [
        clearAlertsAction,
        stopShowValidationAction,
        associateIrsPractitionerWithCaseAction,
        {
          success: [
            setAlertSuccessAction,
            clearModalAction,
            clearModalStateAction,
            clearFormAction,
            setCasePropFromStateAction,
            getCaseAction,
            setCaseAction,
            getPendingEmailsOnCaseAction,
            setPendingEmailsOnCaseAction,
          ],
        },
      ],
    },
  ]);
