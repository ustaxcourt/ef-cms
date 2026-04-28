import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const fileAndServeCourtIssuedDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  data,
) => {
  const { subjectCaseDocketNumber } = data;
  return post({
    applicationContext,
    body: data,
    endpoint: `/async/case-documents/${subjectCaseDocketNumber}/file-and-serve-court-issued-docket-entry`,
  });
};
