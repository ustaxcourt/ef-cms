import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const strikeDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/strike`,
  });
};
