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
    body: Buffer.from(results).toString('base64'),
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    isBase64Encoded: true,
    statusCode: 200,
  };
};
