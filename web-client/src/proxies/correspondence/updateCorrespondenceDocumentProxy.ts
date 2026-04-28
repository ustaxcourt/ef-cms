import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCorrespondenceDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { correspondenceId, documentMetadata },
) => {
  const { docketNumber } = documentMetadata;

  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/correspondence/${correspondenceId}`,
  });
};
