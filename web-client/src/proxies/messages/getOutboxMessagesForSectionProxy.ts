import { MessageResult } from 'shared/src/business/entities/MessageResult';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getOutboxMessagesForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
): Promise<ExcludeMethods<MessageResult>[]> => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/section/${section}`,
  });
};
