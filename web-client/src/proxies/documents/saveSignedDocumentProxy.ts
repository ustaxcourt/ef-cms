import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const saveSignedDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    nameForSigning,
    originalDocketEntryId,
    parentMessageId,
    signedDocumentStorageId,
  },
) => {
  return post({
    applicationContext,
    body: {
      nameForSigning,
      parentMessageId,
      signedDocumentStorageId,
    },
    endpoint: `/case-documents/${docketNumber}/${originalDocketEntryId}/sign`,
  });
};
