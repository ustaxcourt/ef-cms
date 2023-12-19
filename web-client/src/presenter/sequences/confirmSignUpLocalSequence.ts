import { confirmSignUpLocalAction } from '../actions/confirmSignUpLocalAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

// TODO 10007: this can probably be unified with the other change password stuff
export const confirmSignUpLocalSequence = [
  confirmSignUpLocalAction,
  {
    no: [setAlertErrorAction],
    yes: [setAlertSuccessAction],
  },
  navigateToLoginSequence,
];
