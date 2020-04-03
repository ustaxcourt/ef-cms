import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createAttorneyUserAction } from '../actions/createAttorneyUserAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAttorneyUserAction } from '../actions/validateAttorneyUserAction';

export const submitCreateAttorneyUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateAttorneyUserAction,
  {
    error: [setAlertErrorAction],
    success: [
      setCurrentPageAction('Interstitial'),
      createAttorneyUserAction,
      {
        error: [],
        success: [setAlertSuccessAction, setSaveAlertsForNavigationAction],
      },
    ],
  },
];
