import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const fileCourtIssuedDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumbers, documentMeta, subjectDocketNumber },
): Promise<{ pendingCoversheetDocketEntryIds?: string[] }> => {
  return post({
    applicationContext,
    body: {
      docketNumbers,
      documentMeta,
      subjectDocketNumber,
    },
    endpoint: `/case-documents/${subjectDocketNumber}/court-issued-docket-entry`,
  });
};
