import { state } from 'cerebral';
import { uniq } from 'lodash';

export const publicAlertHelper = get => {
  const alertError = get(state.alertError) || {};

  return {
    messagesDeduped: uniq(alertError.messages),
    responseCode: alertError.responseCode,
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showMultipleMessages: !!alertError.messages,
    showSingleMessage: !!alertError.message,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
