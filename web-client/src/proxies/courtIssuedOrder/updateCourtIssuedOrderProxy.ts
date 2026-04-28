import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCourtIssuedOrderInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryIdToEdit, documentMetadata },
) => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-orders/${docketEntryIdToEdit}`,
  });
};
