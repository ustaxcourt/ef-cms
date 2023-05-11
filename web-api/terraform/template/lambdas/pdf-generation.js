import { createApplicationContext } from '../../../src/applicationContext';

/**
 * handler
 */
export const handler = async event => {
  const applicationContext = createApplicationContext();

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event);

  return {
    body: results,
    headers: {
      'Content-Type': 'application/pdf',
    },
    isBase64Encoded: false,
    statusCode: 200,
  };
};
