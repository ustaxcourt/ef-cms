import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const unsealDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
): Promise<RawDocketEntry> => {
  return put({
    applicationContext,
    body: {
      docketEntryId,
      docketNumber,
    },
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/unseal`,
  });
};
