import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';
import { updateUserPendingEmailAction } from '@web-client/presenter/actions/updateUserPendingEmailAction';

export const resendVerifyPendingUserEmailSequence = [
  updateUserPendingEmailAction,
  setShowModalFactoryAction('VerifyNewEmailModal'),
] as unknown as (props: { pendingEmail: string }) => void;
