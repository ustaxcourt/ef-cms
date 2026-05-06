import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { sleep } from '@shared/tools/helpers';
import { get, post, RequestApplicationContext } from '../requests';

type PublicDocketRecordStatusResponse =
  | { status: 'pending' }
  | { status: 'ready'; url: string }
  | { status: 'error'; message?: string };

const POLL_INTERVAL_MS_BEFORE_ATTEMPT_10 = 1500;
const POLL_INTERVAL_MS_FROM_ATTEMPT_10 = 5000;

/**
 * Generates a printable docket record PDF for the public case detail view.
 *
 * Supports both API shapes:
 * - Async (e.g. `test`): POST returns `{ jobId }`; poll `/public-api/docket-record-status/:jobId`.
 * - Legacy synchronous (e.g. current `staging`): POST returns `{ url }` immediately.
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
  const startResponse = (await post({
    applicationContext,
    body: {
      docketNumber,
      docketRecordTableSort,
    },
    endpoint: `/public-api/cases/${docketNumber}/generate-docket-record`,
  })) as { jobId?: string; url?: string };

  const { jobId, url: synchronousUrl } = startResponse;

  if (synchronousUrl) {
    return { url: synchronousUrl };
  }

  if (!jobId) {
    throw new Error(
      'Unexpected response from public docket record PDF: missing jobId and url.',
    );
  }

  let attemptNumber = 1;
  const expirationTimestamp =
    Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + 16 * 60;

  while (true) {
    const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
    if (expirationTimestamp < nowSeconds) {
      throw new Error(
        'Timed out while waiting for the public printable docket record PDF.',
      );
    }

    // `get` is memoized by endpoint string; vary the query so each poll is fresh.
    const result = (await get({
      applicationContext,
      endpoint: `/public-api/docket-record-status/${jobId}?pollAttempt=${attemptNumber}`,
    })) as PublicDocketRecordStatusResponse;

    if (result.status === 'ready' && result.url) {
      return { url: result.url };
    }

    if (result.status === 'error') {
      throw new Error(
        result.message ?? 'Failed to generate public docket record PDF.',
      );
    }

    const waitMs =
      attemptNumber < 10
        ? POLL_INTERVAL_MS_BEFORE_ATTEMPT_10
        : POLL_INTERVAL_MS_FROM_ATTEMPT_10;
    await sleep(waitMs);
    attemptNumber += 1;
  }
};
