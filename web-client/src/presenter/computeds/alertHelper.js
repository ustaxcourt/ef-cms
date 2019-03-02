import { state } from 'cerebral';

export default get => {
  const alertError = get(state.alertError) || {};
  const userIsIdentified = get(state.user) || false;

  return {
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showLogIn: userIsIdentified,
    showMultipleMessages: !!alertError.messages,
    showSingleMessage: !!alertError.message,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
