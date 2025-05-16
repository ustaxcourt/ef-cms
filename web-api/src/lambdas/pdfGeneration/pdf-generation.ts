import { logLambdaStats } from '@web-api/lambdas/pdfGeneration/lambdaStats';
import { createApplicationContext } from '../../applicationContext';
import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';

export type PdfGenerationResult = {
  tempId: string;
};

export const handler = async event => {
  const MAX_RETRIES = 4;
  const RETRY_DELAY_MS = 100;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const applicationContext = createApplicationContext({});
  let browser;

  console.log('PDF Investigation: About to get chromium browser');
  logLambdaStats();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      browser = await getChromiumBrowser();
    } catch (err: any) {
      console.error('PDF Investigation: stderr:', err?.stderr);
      console.error(
        'PDF Investigation: Browser launch error: ',
        JSON.stringify(err),
      );

      browser = null;

      logLambdaStats();
      await delay(RETRY_DELAY_MS);
    }
  }

  if (!browser) {
    throw new Error('Failed to launch chromium after multiple attempts.');
  }

  logLambdaStats();
  console.log('PDF Investigation: About to generate pdf from html');

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(event, browser);

  console.log(
    'PDF Investigation: Finished generating pdf; about to close browser',
  );

  await browser.close();

  console.log('PDF Investigation: Closed browser');
  logLambdaStats();

  const tempId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: results,
    key: tempId,
    useTempBucket: true,
  });

  return { tempId };
};
