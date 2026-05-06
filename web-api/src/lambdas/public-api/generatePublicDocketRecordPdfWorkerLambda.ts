import { generateDocketRecordPdfInteractor } from '@web-api/business/useCases/generateDocketRecordPdfInteractor';
import { genericHandler } from '../../genericHandler';

export const PUBLIC_DOCKET_RECORD_S3_PREFIX = 'public-docket-record/';
export const resultKey = (jobId: string) =>
  `${PUBLIC_DOCKET_RECORD_S3_PREFIX}${jobId}.json`;
export const errorKey = (jobId: string) =>
  `${PUBLIC_DOCKET_RECORD_S3_PREFIX}${jobId}.error`;

/**
 * Invoked asynchronously by the public "start" lambda via the Lambda SDK.
 * Calls the shared docket-record interactor (which uploads the PDF to the
 * temp S3 bucket at its own random key) and then writes a small marker at
 * a deterministic key, pointing at that random key. The polling lambda
 * reads the marker to know the job is done and to issue a fresh presigned
 * URL for the actual PDF. On failure, a sibling `.error` marker is written
 * so the polling lambda can surface the failure instead of letting the
 * client poll forever.
 */
export const generatePublicDocketRecordPdfWorkerLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const payload =
        typeof event.body === 'string' ? JSON.parse(event.body) : event;
      const { docketNumber, docketRecordTableSort, jobId } = payload;

      try {
        const { fileId } = await generateDocketRecordPdfInteractor(
          applicationContext,
          {
            docketNumber,
            docketRecordTableSort,
            includePartyDetail: false,
          },
          undefined,
        );

        await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
          contentType: 'application/json',
          document: Buffer.from(JSON.stringify({ fileId })),
          key: resultKey(jobId),
          useTempBucket: true,
        });
      } catch (err: any) {
        await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
          contentType: 'application/json',
          document: Buffer.from(
            JSON.stringify({
              message: err?.message || 'Failed to generate docket record',
              statusCode: err?.statusCode || 500,
            }),
          ),
          key: errorKey(jobId),
          useTempBucket: true,
        });
        throw err;
      }
    },
    { logResults: false },
  );
