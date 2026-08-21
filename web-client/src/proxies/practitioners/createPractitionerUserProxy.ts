import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const createPractitionerUserInteractor = (
  applicationContext: ClientApplicationContext,
  { user },
): Promise<{ barNumber: string }> => {
  return post({
    applicationContext,
    body: { user },
    endpoint: '/practitioners',
  });
};
