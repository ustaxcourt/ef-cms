import { setVerifyUserPendingEmailNotificationAction } from '@web-client/presenter/actions/verifyUserPendingEmailAction';

export const setVerifyEmailNotificationSequence = [
  setVerifyUserPendingEmailNotificationAction,
] as unknown as (props: { messageType: string }) => void;
