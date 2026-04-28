import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const sealDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketEntrySealedTo, docketNumber },
) => {
  return put({
    applicationContext,
    body: {
      docketEntryId,
      docketEntrySealedTo,
      docketNumber,
    },
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/seal`,
  });
};
