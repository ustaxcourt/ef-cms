import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { createPractitionerUserAction } from '../actions/createPractitionerUserAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

export const submitAddPractitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeFormDateFactoryAction(null),
  validateAddPractitionerAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setCurrentPageAction('Interstitial'),
      createPractitionerUserAction,
      {
        error: [],
        success: [
          setAlertSuccessAction,
          setSaveAlertsForNavigationAction,
          navigateToPractitionerDetailAction,
        ],
      },
    ],
  },
];
