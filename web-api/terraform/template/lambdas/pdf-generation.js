import { createApplicationContext } from '../../../src/applicationContext';

/**
 * handler
 */
export const handler = async (event, context, cb) => {
  console.log('event', event);

  const applicationContext = createApplicationContext();

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event);

  console.log('results', results);
  cb(null, results);
};
