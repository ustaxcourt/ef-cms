import { Message } from 'shared/src/business/entities/Message';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getMessageThreadInteractor = (
  applicationContext: ClientApplicationContext,
  { parentMessageId },
): Promise<ExcludeMethods<Message>[]> => {
  return get({
    applicationContext,
    endpoint: `/messages/${parentMessageId}`,
  });
};
