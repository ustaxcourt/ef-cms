import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateContactInteractor = (
  applicationContext: ClientApplicationContext,
  { contactInfo, docketNumber },
) => {
  return put({
    applicationContext,
    body: { contactInfo, docketNumber },
    endpoint: `/case-parties/${docketNumber}/contact`,
  });
};
