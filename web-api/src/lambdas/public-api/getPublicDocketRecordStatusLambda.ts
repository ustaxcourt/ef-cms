import { errorKey, resultKey } from './generatePublicDocketRecordPdfWorkerLambda';
import { genericHandler } from '../../genericHandler';

/**
 * Polled by the public UI while the docket-record PDF is being generated
 * by the background worker. Reports one of:
 *   - { status: 'ready', url }   — worker finished; issue a fresh presigned URL
 *   - { status: 'error', ... }   — worker wrote an error marker
 *   - { status: 'pending' }      — keep polling
 *
 * The `jobId` is an opaque, server-generated UUID; the marker it points to
 * is scoped under `public-docket-record/`, so clients cannot use this
 * endpoint to probe arbitrary S3 keys.
 */
export const getPublicDocketRecordStatusLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { jobId } = event.pathParameters;

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
      const { fileId } = JSON.parse(Buffer.from(markerBytes).toString('utf-8'));
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
