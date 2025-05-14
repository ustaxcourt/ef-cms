import { logLambdaStats } from '@web-api/lambdas/pdfGeneration/lambdaStats';
import { createApplicationContext } from '../../applicationContext';

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
      browser = await applicationContext.getChromiumBrowser();
    } catch (err: any) {
      console.error('PDF Investigation: stderr:', err?.stderr);
      console.error(
        'PDF Investigation: Browser launch error: ',
        JSON.stringify(err),
      );

      browser = null;

      logLambdaStats();
      await delay(RETRY_DELAY_MS * Math.pow(2, attempt - 1));
    }
  }

  if (!browser) {
    throw new Error('Failed to launch chromium after multiple attempts.');
  }

  logLambdaStats();
  console.log('PDF Investigation: About to generate pdf from html');

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event, browser);

  console.log(
    'PDF Investigation: Finished generating pdf; about to close browser',
  );

  await browser.close();

  console.log('PDF Investigation: Closed browser');
  logLambdaStats();

  const tempId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: results,
    key: tempId,
    useTempBucket: true,
  });

  return { tempId };
};

export const changeOfAddressHandler = async event => {
  const { Records } = event;
  const { body } = Records[0];
  const eventBody = JSON.parse(body);

  const applicationContext = createApplicationContext(eventBody.requestUser);

  applicationContext.logger.info(
    `processing job "change-of-address-job|${eventBody.jobId}", task for case ${eventBody.docketNumber}`,
  );

  await applicationContext.getUseCaseHelpers().generateChangeOfAddressHelper({
    applicationContext,
    authorizedUser: eventBody.requestUser,
    bypassDocketEntry: eventBody.bypassDocketEntry,
    contactInfo: eventBody.contactInfo,
    docketNumber: eventBody.docketNumber,
    firmName: eventBody.firmName,
    jobId: eventBody.jobId,
    requestUserId: eventBody.requestUserId,
    updatedEmail: eventBody.updatedEmail,
    updatedName: eventBody.updatedName,
    user: eventBody.user,
    websocketMessagePrefix: eventBody.websocketMessagePrefix,
  });
};
