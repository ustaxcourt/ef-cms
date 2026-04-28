import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const sealCaseContactAddressInteractor = (
  applicationContext: ClientApplicationContext,
  { contactId, docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/seal-address/${contactId}`,
  });
};
