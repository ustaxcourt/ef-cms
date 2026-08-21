import { clearUserAction } from '../../actions/clearUserAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/gotoLoginSequence';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertInfoAction } from '@web-client/presenter/actions/setAlertInfoAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setInitialVerifyAlertMessageAction } from '@web-client/presenter/actions/setInitialVerifyAlertMessageAction';
import { verifyUserPendingEmailAction } from '../../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence = [
  setInitialVerifyAlertMessageAction,
  setAlertInfoAction,
  gotoLoginSequence,
  verifyUserPendingEmailAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  clearUserAction,
] as unknown as (props: { token: string }) => void;
