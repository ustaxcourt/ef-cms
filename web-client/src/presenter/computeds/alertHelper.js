import { state } from 'cerebral';
import { uniq } from 'lodash';

export const alertHelper = (get, applicationContext) => {
  const alertError = get(state.alertError) || {};
  const userIsIdentified = applicationContext.getCurrentUser() || false;

  return {
    messagesDeduped: uniq(alertError.messages),
    preventAutoScroll: false,
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showLogIn: userIsIdentified,
    showMultipleMessages: !!alertError.messages,
    showSingleMessage: !!alertError.message,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
