import { backOff } from '../../../../shared/src/tools/helpers';

/**
 * calls SES.sendBulkTemplatedEmail
 *
 * destinations = [
 *   {
 *      email: 'mayor@flavortown.com',
 *      templateData: { myCustomVar1: 'value', myCustomVar2: 'value' }
 *   }
 * ]
 *
 * For each key in 'templateData', we must have default template data values:
 * defaultTemplateData: {
 *   myCustomVar1: 'undefined',
 *   myCustomVar2: 'undefined'
 * }
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext application context
 * @param {object} providers.defaultTemplateData default values correlated with templateData matching the format described above
 * @param {Array} providers.destinations array of destinations matching the format described above
 * @param {string} providers.templateName name of the SES template
 * @returns {void}
 */
export const sendBulkTemplatedEmail = async ({
  applicationContext,
  defaultTemplateData,
  destinations,
  templateName,
}) => {
  try {
    await applicationContext.getMessageGateway().sendEmailEventToQueue({
      applicationContext,
      emailParams: {
        DefaultTemplateData: JSON.stringify(defaultTemplateData),
        Destinations: destinations.map(destination => ({
          Destination: {
            ToAddresses: [destination.email],
          },
          ReplacementTemplateData: JSON.stringify(destination.templateData),
        })),
        ReturnPath:
          process.env.BOUNCED_EMAIL_RECIPIENT || process.env.EMAIL_SOURCE,
        Source: process.env.EMAIL_SOURCE,
        Template: templateName,
      },
    });
  } catch (err) {
    applicationContext.logger.error(`Error sending email: ${err}`, err);
    throw err;
  }
};

/**
 * Sends the email via SES, and retry `MAX_SES_RETRIES` number of times
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext application context
 * @param {object} providers.params the parameters to send to SES
 * @param {number} providers.retryCount the number of retries attempted
 */
export const sendWithRetry = async ({
  applicationContext,
  params,
  retryCount = 0,
}) => {
  const SES = applicationContext.getEmailClient();
  const { MAX_SES_RETRIES } = applicationContext.getConstants();

  applicationContext.logger.info('Bulk Email Params', params);
  const response = await SES.sendBulkTemplatedEmail(params).promise();
  applicationContext.logger.info('Bulk Email Response', response);

  // parse response from AWS
  const needToRetry = response.Status.map((attempt, index) => {
    // AWS returns 'Success' and helpful identifier upon successful delivery
    return attempt.Status !== 'Success' ? params.Destinations[index] : false;
  }).filter(Boolean);

  if (needToRetry.length === 0) {
    return;
  }

  if (retryCount >= MAX_SES_RETRIES) {
    const failures = needToRetry
      .map(dest => dest.Destination.ToAddresses[0])
      .join(',');
    throw `Could not complete service to ${failures}`;
  }

  // exponential back-off
  await backOff(retryCount);

  await sendWithRetry({
    applicationContext,
    params: {
      ...params,
      Destinations: needToRetry,
    },
    retryCount: retryCount + 1,
  });
};
