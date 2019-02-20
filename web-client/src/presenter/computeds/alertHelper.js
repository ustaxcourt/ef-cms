import { state } from 'cerebral';

export default get => {
  const alertError = get(state.alertError) || {};
  const userIsIdentified = get(state.user) || false;

  return {
    showLogIn: userIsIdentified,
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showSingleMessage: !!alertError.message,
    showMultipleMessages: !!alertError.messages,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
