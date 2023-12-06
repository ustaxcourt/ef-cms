import { state } from '@web-client/presenter/app-public.cerebral';
import { uniq } from 'lodash';

import { Get } from 'cerebral';
export const publicAlertHelper = (get: Get) => {
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
