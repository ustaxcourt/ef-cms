import { Message } from 'shared/src/business/entities/Message';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getMessagesForCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<ExcludeMethods<Message>[]> => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${docketNumber}`,
  });
};
