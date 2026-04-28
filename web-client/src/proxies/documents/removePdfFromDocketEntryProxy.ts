import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removePdfFromDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/remove-pdf`,
  });
};
