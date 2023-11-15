import { state } from '@web-client/presenter/app.cerebral';
import { uniq } from 'lodash';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const alertHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const alertError = get(state.alertError) || {};
  const userIsIdentified = applicationContext.getCurrentUser() || false;

  return {
    messagesDeduped: uniq(alertError.messages),
    preventAutoScroll: false,
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
