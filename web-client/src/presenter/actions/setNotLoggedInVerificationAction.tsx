import { genericAlertError } from '@web-client/presenter/actions/verifyUserPendingEmailAction';
import { state } from '@web-client/presenter/app.cerebral';

export const setNotLoggedInVerificationAction = ({
  store,
}: ActionProps<{ alertInfo: any }>) => {
  store.set(state.alertWarning, genericAlertError);
};
