import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getMessageThreadInteractor = (
  applicationContext: ClientApplicationContext,
  { parentMessageId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/${parentMessageId}`,
  });
};
