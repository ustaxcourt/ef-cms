import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateAttorneyUserAction } from '../actions/updateAttorneyUserAction';
import { validateAttorneyUserAction } from '../actions/validateAttorneyUserAction';

export const submitUpdateAttorneyUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateAttorneyUserAction,
  {
    error: [setAlertErrorAction],
    success: [
      setCurrentPageAction('Interstitial'),
      updateAttorneyUserAction,
      {
        error: [],
        success: [setAlertSuccessAction, setSaveAlertsForNavigationAction],
      },
    ],
  },
];
