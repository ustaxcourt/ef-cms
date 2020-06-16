import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePractitionerUserAction } from '../actions/updatePractitionerUserAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

export const submitUpdatePractitionerUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeFormDateAction,
  validateAddPractitionerAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setCurrentPageAction('Interstitial'),
      updatePractitionerUserAction,
      {
        error: [],
        success: [
          setPractitionerDetailAction,
          setAlertSuccessAction,
          setSaveAlertsForNavigationAction,
          navigateToPractitionerDetailAction,
        ],
      },
    ],
  },
];
