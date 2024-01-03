import { confirmSignUpAction } from '../actions/confirmSignUpAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

// TODO 10007: this can probably be unified with the other change password stuff
export const confirmSignUpSequence = [
  confirmSignUpAction,
  {
    no: [setAlertErrorAction],
    yes: [setAlertSuccessAction],
  },
  navigateToLoginSequence,
];
