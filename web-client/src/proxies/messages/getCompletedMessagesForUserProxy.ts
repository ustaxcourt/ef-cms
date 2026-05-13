import { MessageResult } from 'shared/src/business/entities/MessageResult';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCompletedMessagesForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
): Promise<ExcludeMethods<MessageResult>[]> => {
  return get({
    applicationContext,
    endpoint: `/messages/completed/${userId}`,
  });
};
