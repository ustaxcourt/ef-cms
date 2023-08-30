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
  const applicationContext = createApplicationContext();

  await applicationContext.getUseCaseHelpers().generateChangeOfAddressHelper({
    applicationContext,
    bypassDocketEntry: event.bypassDocketEntry,
    contactInfo: event.contactInfo,
    docketNumber: event.docketNumber,
    firmName: event.firmName,
    requestUserId: event.requestUserId,
    updatedEmail: event.updatedEmail,
    updatedName: event.updatedName,
  });
};
