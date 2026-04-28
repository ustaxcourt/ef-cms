import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getMessagesForCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${docketNumber}`,
  });
};
