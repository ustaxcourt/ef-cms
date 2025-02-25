import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { uniq } from 'lodash';

const DEFAULT_ALERT_ERROR = {
  message: undefined,
  messages: undefined,
  responseCode: undefined,
  title: undefined,
};

export const alertHelper = (get: Get): any => {
  const alertError = get(state.alertError) || DEFAULT_ALERT_ERROR;
  const userIsIdentified = get(state.token) || false;

  return {
    messagesDeduped: uniq(alertError.messages).filter(Boolean),
    responseCode: alertError.responseCode,
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showLogIn: userIsIdentified,
    showMultipleMessages: !!alertError.messages,
    showSingleMessage: !!alertError.message,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
