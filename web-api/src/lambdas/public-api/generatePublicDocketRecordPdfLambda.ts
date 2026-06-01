import { InvokeCommand } from '@aws-sdk/client-lambda';
import { environment } from '@web-api/environment';
import { genericHandler } from '../../genericHandler';
import { getLambdaClient } from '@web-api/gateways/lambda/getLambdaClient';
import { getUniqueId } from '@shared/sharedAppContext';

/**
 * Public "start" endpoint for generating a printable docket record PDF.
 *
 * API Gateway caps synchronous requests at 29 seconds, which is not enough
 * time to render very large docket records. This handler generates a
 * unique `jobId`, asynchronously invokes the long-timeout worker lambda,
 * and returns immediately so the client can poll for the resulting URL.
 */
export const generatePublicDocketRecordPdfLambda = event =>
  genericHandler(
    event,
    async () => {
      const { docketNumber, docketRecordTableSort } = JSON.parse(event.body);
      const jobId = getUniqueId();

      if (environment.stage === 'local') {
        // Locally there is no deployed worker lambda; invoke the worker
        // handler in-process so the feature is exercisable end-to-end.
        const { generatePublicDocketRecordPdfWorkerLambda } = await import(
          './generatePublicDocketRecordPdfWorkerLambda'
        );
        // fire-and-forget: do not await so the HTTP response returns quickly
        void generatePublicDocketRecordPdfWorkerLambda({
          body: JSON.stringify({ docketNumber, docketRecordTableSort, jobId }),
        });
      } else {
        await getLambdaClient().send(
          new InvokeCommand({
            FunctionName: `public_async_docket_record_pdf_${environment.stage}_${environment.currentColor}`,
            InvocationType: 'Event',
            Payload: Buffer.from(
              JSON.stringify({
                body: JSON.stringify({
                  docketNumber,
                  docketRecordTableSort,
                  jobId,
                }),
              }),
            ),
          }),
        );
      }

      return { jobId };
    },
    { logResults: false },
  );
