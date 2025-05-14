import { logLambdaStats } from '@web-api/lambdas/pdfGeneration/lambdaStats';
import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';
import { applicationContext } from '@web-api/applicationContext';
import { Browser } from 'puppeteer-core';

export type PdfGenerationResult = {
  tempId: string;
};

export const handler = async event => {
  let browser: Browser;
  console.log('PDF Investigation: About to get chromium browser');
  logLambdaStats();
  try {
    browser = await getChromiumBrowser();
  } catch (err) {
    console.log('PDF Investigation: launch error');
    logLambdaStats();
    throw err;
  }
  logLambdaStats();
  console.log('PDF Investigation: About to generate pdf from html');

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event, browser);

  const pages = await browser.pages();
  await Promise.all(pages.map(p => p.close()));

  console.log(
    'PDF Investigation: Finished generating pdf; about to close browser',
  );

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
