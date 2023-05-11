import { createApplicationContext } from '../../../src/applicationContext';

/**
 * handler
 */
export const handler = async (event, context, cb) => {
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

  cb(null, tempId);
};
