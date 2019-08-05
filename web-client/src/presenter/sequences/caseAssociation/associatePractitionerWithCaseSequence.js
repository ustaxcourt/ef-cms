import { associatePractitionerWithCaseAction } from '../../actions/ManualAssociation/associatePractitionerWithCaseAction';
import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearModalAction } from '../../actions/clearModalAction';
import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { setAlertSuccessAction } from '../../actions/setAlertSuccessAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCasePropFromStateAction } from '../../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { validateAddPractitionerAction } from '../../actions/caseAssociation/validateAddPractitionerAction';

export const associatePractitionerWithCaseSequence = [
  startShowValidationAction,
  validateAddPractitionerAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      associatePractitionerWithCaseAction,
      {
        success: [
          setAlertSuccessAction,
          clearModalAction,
          clearModalStateAction,
          setCasePropFromStateAction,
          getCaseAction,
          setCaseAction,
        ],
      },
    ],
  },
];
