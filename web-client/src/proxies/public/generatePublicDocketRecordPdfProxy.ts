import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { RequestApplicationContext, getResponse, post } from '../requests';

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 16 * 60 * 1_000; // matches the authenticated async-sync TTL
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * generatePublicDocketRecordPdfInteractor (proxy)
 *
 * API Gateway caps synchronous responses at 29 seconds, but very large
 * docket records take longer than that to render. Instead we POST to the
 * public "start" endpoint, which kicks off a background worker and returns
 * a `jobId`, then poll the status endpoint until it returns a presigned
 * `url`.
 */
export const generatePublicDocketRecordPdfInteractor = async (
  applicationContext: RequestApplicationContext,
  {
    docketNumber,
    docketRecordTableSort,
  }: {
    docketNumber: string;
    docketRecordTableSort: {
      sortField: string;
      sortOrder: string;
    };
  },
): Promise<{ url: string }> => {
  const { jobId } = await post({
    applicationContext,
    body: { docketNumber, docketRecordTableSort },
    endpoint: `/public-api/cases/${docketNumber}/generate-docket-record`,
  });

  const deadline = getCurrentDateTimeInMillis() + POLL_TIMEOUT_MS;
  while (getCurrentDateTimeInMillis() < deadline) {
    // Use getResponse (not `get`) to bypass the 5s in-flight endpoint cache;
    // otherwise every poll returns the first `pending` response until deadline.
    const response = await getResponse({
      applicationContext,
      endpoint: `/public-api/docket-record-status/${jobId}`,
    });
    const result = response.data;

    if (result.status === 'ready') {
      return { url: result.url };
    }
    if (result.status === 'error') {
      const err = new Error(
        result.message || 'Failed to generate docket record',
      );
      (err as any).statusCode = result.statusCode || 500;
      throw err;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('Timed out waiting for docket record PDF');
};
