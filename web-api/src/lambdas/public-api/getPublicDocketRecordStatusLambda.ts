import { errorKey, resultKey } from './generatePublicDocketRecordPdfWorkerLambda';
import { genericHandler } from '../../genericHandler';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Polled by the public UI while the docket-record PDF is being generated
 * by the background worker. Reports one of:
 *   - { status: 'ready', url }   — worker finished; issue a fresh presigned URL
 *   - { status: 'error', ... }   — worker wrote an error marker, or the
 *                                  marker itself was malformed
 *   - { status: 'pending' }      — keep polling
 *
 * The `jobId` is an opaque, server-generated UUID; the marker it points to
 * is scoped under `public-docket-record/`, so clients cannot use this
 * endpoint to probe arbitrary S3 keys.
 */
export const getPublicDocketRecordStatusLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { jobId } = event.pathParameters;

    // Reject anything that isn't a UUID so clients can't craft keys like
    // `../foo` and probe the temp bucket via the S3 client.
    if (typeof jobId !== 'string' || !UUID_REGEX.test(jobId)) {
      return {
        message: 'Invalid jobId',
        status: 'error',
        statusCode: 400,
      };
    }

    const [isReady, hasError] = await Promise.all([
      applicationContext.getPersistenceGateway().isFileExists({
        applicationContext,
        key: resultKey(jobId),
        useTempBucket: true,
      }),
      applicationContext.getPersistenceGateway().isFileExists({
        applicationContext,
        key: errorKey(jobId),
        useTempBucket: true,
      }),
    ]);

    if (isReady) {
      const markerBytes = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: resultKey(jobId),
          useTempBucket: true,
        });

      let fileId: string | undefined;
      try {
        ({ fileId } = JSON.parse(Buffer.from(markerBytes).toString('utf-8')));
      } catch {
        // fall through to the corrupted-marker branch below
      }
      if (!fileId) {
        return {
          message: 'Failed to generate docket record',
          status: 'error',
          statusCode: 500,
        };
      }

      const { url } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          key: fileId,
          useTempBucket: true,
        });
      return { status: 'ready', url };
    }

    if (hasError) {
      const errorBody = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: errorKey(jobId),
          useTempBucket: true,
        });
      let message = 'Failed to generate docket record';
      let statusCode = 500;
      try {
        const parsed = JSON.parse(Buffer.from(errorBody).toString('utf-8'));
        const { message: parsedMessage, statusCode: parsedStatusCode } =
          parsed ?? {};
        if (parsedMessage) message = parsedMessage;
        if (parsedStatusCode) statusCode = parsedStatusCode;
      } catch {
        // leave defaults
      }
      return { message, status: 'error', statusCode };
    }

    return { status: 'pending' };
  });
