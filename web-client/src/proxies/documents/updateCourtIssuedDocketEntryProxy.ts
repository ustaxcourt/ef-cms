import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCourtIssuedDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMeta },
) => {
  const { docketNumber } = documentMeta;
  return put({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-docket-entry`,
  });
};
