import { createApplicationContext } from '../../applicationContext';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export type PdfGenerationResult = {
  tempId: string;
};

export const handler = async event => {
  const applicationContext = createApplicationContext({});

  const browser = await applicationContext.getChromiumBrowser();

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event, browser);

  await browser.close();

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

  const applicationContext = createApplicationContext();
  getLogger().addUser({ user: eventBody.requestUser });

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
