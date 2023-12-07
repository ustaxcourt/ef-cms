import { confirmSignUpLocalAction } from '../actions/confirmSignUpLocalAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Public/goToLoginSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

export const confirmSignUpLocalSequence = [
  confirmSignUpLocalAction,
  {
    no: [setAlertErrorAction],
    yes: [setAlertSuccessAction],
  },
  gotoLoginSequence,
];
