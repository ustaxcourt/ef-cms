import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const fileCorrespondenceDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata, primaryDocumentFileId },
) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${docketNumber}/correspondence`,
  });
};
