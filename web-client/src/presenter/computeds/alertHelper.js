import { state } from 'cerebral';

export default get => {
  const alertError = get(state.alertError);

  return {
    showErrorAlert: alertError !== null,
    showSingleMessage: alertError && !!alertError.message,
    showMultipleMessages: alertError && !!alertError.messages,
    showNoMessage: alertError && !alertError.message && !alertError.messages,
  };
};
