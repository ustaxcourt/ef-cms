import { MessageResult } from 'shared/src/business/entities/MessageResult';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCompletedMessagesForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { filterByInbox, userId }: { filterByInbox?: boolean; userId: string },
): Promise<ExcludeMethods<MessageResult>[]> => {
  const query = filterByInbox ? '?filterByInbox=true' : '';
  return get({
    applicationContext,
    endpoint: `/messages/completed/${userId}${query}`,
  });
};
