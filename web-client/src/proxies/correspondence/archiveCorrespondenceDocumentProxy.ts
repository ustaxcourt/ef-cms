import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const archiveCorrespondenceDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { correspondenceId, docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/correspondence/${correspondenceId}`,
  });
};
