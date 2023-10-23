import { confirmSignUpLocalAction } from '../actions/confirmSignUpLocalAction';
import { navigateToCognitoAction } from '@web-client/presenter/actions/navigateToCognitoAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const confirmSignUpLocalSequence = showProgressSequenceDecorator([
  confirmSignUpLocalAction,
  {
    no: [
      setAlertErrorAction,
      setSaveAlertsForNavigationAction,
      navigateToCognitoAction,
    ],
    yes: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToCognitoAction,
    ],
  },
]);
