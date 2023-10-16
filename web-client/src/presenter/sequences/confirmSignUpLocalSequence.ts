import { confirmSignUpLocalAction } from '../actions/confirmSignUpLocalAction';
import { gotoLoginSequence } from './gotoLoginSequence';
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
      gotoLoginSequence,
    ],
    yes: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      gotoLoginSequence,
    ],
  },
]);
