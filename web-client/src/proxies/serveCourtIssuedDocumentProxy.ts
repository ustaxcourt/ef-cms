import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const serveCourtIssuedDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  data,
): Promise<void> => {
  const { docketEntryId, subjectCaseDocketNumber } = data;

  return post({
    applicationContext,
    body: data,
    endpoint: `/case-documents/${subjectCaseDocketNumber}/${docketEntryId}/serve-court-issued`,
  });
};
