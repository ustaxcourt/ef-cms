import { getChromiumBrowser } from '@shared/business/utilities/chromium/getChromiumBrowser';
import { getUniqueId } from '@shared/sharedAppContext';
import { sleep } from '@shared/tools/helpers';
import {
  generatePdfFromHtmlHelper,
  GeneratePdfRequest,
} from '@web-api/business/useCaseHelper/generatePdfFromHtmlHelper';
import { environment } from '@web-api/environment';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
import { saveDocumentFromLambda } from '@web-api/persistence/s3/saveDocumentFromLambda';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export type PdfGenerationResult = {
  tempId: string;
};

// Note: this lambda is intentionally NOT gated by READ_ONLY_MODE. It is invoked
// synchronously (RequestResponse) by `generatePdfFromHtmlInteractor`, which
// expects a `{ tempId }` response; rescheduling here would return `undefined`
// and crash the caller. PDF rendering only reads HTML and writes to S3 (never
// to Postgres), so it is safe to run during the Aurora Blue/Green switchover.
export const handler = async (event: GeneratePdfRequest) => {
  for (let index = 0; index < 3; index++) {
    try {
      const browser = await getChromiumBrowser();

      const results = await generatePdfFromHtmlHelper(event, browser);

      const pages = await browser.pages();
      await Promise.all(pages.map(p => p.close()));

      const tempId = getUniqueId();

      await saveDocumentFromLambda({
        document: results,
        key: tempId,
        useTempBucket: true,
      });

      return { tempId };
    } catch (e) {
      getDawsonLogger().error(`retrying to generate pdf attempt #${index}`, e);
      await sleep(50);
    }
  }

  const failedEventKey = `failed_pdf_event_${getUniqueId()}.json`;
  const errorMessage = `Error generating pdf. Storing failed pdf event in ${environment.tempDocumentsBucketName} at ${failedEventKey}`;
  getDawsonLogger().error(errorMessage);
  await getStorageClient().putObject({
    Body: JSON.stringify(event),
    Key: failedEventKey,
    Bucket: environment.tempDocumentsBucketName,
    ContentType: 'application/json',
  });
  throw new Error(errorMessage);
};
