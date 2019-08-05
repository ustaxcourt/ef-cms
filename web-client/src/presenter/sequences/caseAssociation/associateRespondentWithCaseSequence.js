import { associateRespondentWithCaseAction } from '../../actions/ManualAssociation/associateRespondentWithCaseAction';
import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearModalAction } from '../../actions/clearModalAction';
import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { setAlertSuccessAction } from '../../actions/setAlertSuccessAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCasePropFromStateAction } from '../../actions/setCasePropFromStateAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { validateAddRespondentAction } from '../../actions/caseAssociation/validateAddRespondentAction';

export const associateRespondentWithCaseSequence = [
  startShowValidationAction,
  validateAddRespondentAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      associateRespondentWithCaseAction,
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
