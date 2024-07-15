import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const setTrialSessionCalendarErrorSequence = [
  unsetWaitingForResponseAction,
  setAlertErrorAction,
] as unknown as (props: {
  alertError: { title: string; message: string };
}) => void;
