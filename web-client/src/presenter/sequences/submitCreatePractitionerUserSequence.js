import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createPractitionerUserAction } from '../actions/createPractitionerUserAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validatePractitionerUserAction } from '../actions/validatePractitionerUserAction';

export const submitCreatePractitionerUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePractitionerUserAction,
  {
    error: [setAlertErrorAction],
    success: [
      setCurrentPageAction('Interstitial'),
      createPractitionerUserAction,
      {
        error: [],
        success: [setAlertSuccessAction, setSaveAlertsForNavigationAction],
      },
    ],
  },
];
