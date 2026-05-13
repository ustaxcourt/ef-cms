import { MessageResult } from 'shared/src/business/entities/MessageResult';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCompletedMessagesForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
): Promise<ExcludeMethods<MessageResult>[]> => {
  return get({
    applicationContext,
    endpoint: `/messages/completed/section/${section}`,
  });
};
