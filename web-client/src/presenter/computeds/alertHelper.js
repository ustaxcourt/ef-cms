import { state } from 'cerebral';

export default get => {
  const alertError = get(state.alertError);
  return {
    showLogIn: !!state.user,
    showErrorAlert: !!alertError,
    showSingleMessage: alertError && !!alertError.message,
    showMultipleMessages: alertError && !!alertError.messages,
    showNoMessage: alertError && !alertError.message && !alertError.messages,
  };
};
