import { createApplicationContext } from '../../../src/applicationContext';

/**
 * handler
 */
export const handler = async event => {
  const applicationContext = createApplicationContext();

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event);

  return results.toString('base64');
};
