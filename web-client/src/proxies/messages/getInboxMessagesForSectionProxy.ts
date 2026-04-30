import { MessageResult } from 'shared/src/business/entities/MessageResult';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getInboxMessagesForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
): Promise<ExcludeMethods<MessageResult>[]> => {
  return get({
    applicationContext,
    endpoint: `/messages/inbox/section/${section}`,
  });
};
