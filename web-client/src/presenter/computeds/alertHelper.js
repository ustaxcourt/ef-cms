import { state } from 'cerebral';
import { uniq } from 'lodash';

export const alertHelper = get => {
  const alertError = get(state.alertError) || {};
  const userIsIdentified = get(state.user) || false;

  return {
    messagesDeduped: uniq(alertError.messages),
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showLogIn: userIsIdentified,
    showMultipleMessages: !!alertError.messages,
    showSingleMessage: !!alertError.message,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
