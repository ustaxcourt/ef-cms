import { ClientApplicationContext } from '@web-client/applicationContext';
import { getCurrentUserToken } from '../requests';

const getDefaultHeaders = () => {
  const token = getCurrentUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Bypasses the shared memoized GET wrapper so the client can poll the
 * endpoint for live state changes without hitting the 5-second response cache.
 */
export const getDocketEntryProcessingStatusInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
): Promise<{ processingStatus: string }> => {
  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/case-documents/${docketNumber}/${docketEntryId}/processing-status`,
      { headers: getDefaultHeaders() },
    );
  return response.data;
};
