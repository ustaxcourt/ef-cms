import { associatePrivatePractitionerWithCaseAction } from '../../actions/ManualAssociation/associatePrivatePractitionerWithCaseAction';
import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearFormAction } from '../../actions/clearFormAction';
import { clearModalAction } from '../../actions/clearModalAction';
import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getPendingEmailsOnCaseAction } from '../../actions/getPendingEmailsOnCaseAction';
import { setAlertSuccessAction } from '../../actions/setAlertSuccessAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCasePropFromStateAction } from '../../actions/setCasePropFromStateAction';
import { setConsolidatedCasesForCaseAction } from '../../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setPendingEmailsOnCaseAction } from '../../actions/setPendingEmailsOnCaseAction';
import { setRepresentingFromRepresentingMapActionFactory } from '../../actions/setRepresentingFromRepresentingMapActionFactory';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateAddPrivatePractitionerAction } from '../../actions/CaseAssociation/validateAddPrivatePractitionerAction';

export const associatePrivatePractitionerWithCaseSequence =
  showProgressSequenceDecorator([
    startShowValidationAction,
    setRepresentingFromRepresentingMapActionFactory('modal'),
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
            getConsolidatedCasesByCaseAction,
            setConsolidatedCasesForCaseAction,
            getPendingEmailsOnCaseAction,
            setPendingEmailsOnCaseAction,
          ],
        },
      ],
    },
  ]);
