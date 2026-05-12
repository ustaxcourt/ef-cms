import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDocketEntryProcessingStatusInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: {
    docketEntryId: string;
    docketNumber: string;
  },
): Promise<{ processingStatus: string }> =>
  get({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/processing-status`,
  });
