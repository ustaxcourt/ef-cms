import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export const getDocketEntryProcessingStatusInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
): Promise<{ processingStatus: string }> => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/processing-status`,
    skipCache: true,
  });
};
