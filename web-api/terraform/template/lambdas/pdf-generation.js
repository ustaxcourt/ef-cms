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
