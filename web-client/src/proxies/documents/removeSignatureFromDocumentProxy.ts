import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removeSignatureFromDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/remove-signature`,
  });
};
