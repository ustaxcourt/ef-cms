import { confirmSignUpLocalAction } from '../actions/confirmSignUpLocalAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

export const confirmSignUpLocalSequence = [
  confirmSignUpLocalAction,
  {
    no: [setAlertErrorAction],
    yes: [setAlertSuccessAction],
  },
  navigateToLoginSequence,
];
