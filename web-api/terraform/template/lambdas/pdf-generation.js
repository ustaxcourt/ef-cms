import { createApplicationContext } from '../../../src/applicationContext';

/**
 * handler
 * @returns {string} id for the temporary stored pdf
 */
export const handler = async event => {
  const applicationContext = createApplicationContext();

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event);

  const tempId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: results,
    key: tempId,
    useTempBucket: true,
  });

  return tempId;
};

/**
 * changeOfAddressHandler
 * @returns {string} id for the temporary stored pdf
 */
export const changeOfAddressHandler = async event => {
  const { Records } = event;
  const { body } = Records[0];
  const eventBody = JSON.parse(body);

  const applicationContext = createApplicationContext(eventBody.requestUser);

  await applicationContext.getUseCaseHelpers().generateChangeOfAddressHelper({
    applicationContext,
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
