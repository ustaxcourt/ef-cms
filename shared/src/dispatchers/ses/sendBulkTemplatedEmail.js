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
exports.sendBulkTemplatedEmail = async ({
  applicationContext,
  defaultTemplateData,
  destinations,
  templateName,
}) => {
  try {
    const params = {
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
    };

    await exports.sendWithRetry(applicationContext, { params });
  } catch (err) {
    applicationContext.logger.error(`Error sending email: ${err.message}`, err);
  }
};

const MAX_RETRIES = 10;

/**
 *
 */
exports.sendWithRetry = async (
  applicationContext,
  { params, retryCount = 0 },
) => {
  const SES = applicationContext.getEmailClient();

  applicationContext.logger.info('Bulk Email Params', params);
  const response = await SES.sendBulkTemplatedEmail(params).promise();
  applicationContext.logger.info('Bulk Email Response', response);

  const needToRetry = response.Status.map((attempt, index) => {
    if (attempt.Status !== 'Success') {
      return params.Destinations[index];
    }
    return false;
  }).filter(row => !!row);

  if (needToRetry.length) {
    params.Destinations = needToRetry;

    if (retryCount >= MAX_RETRIES) {
      const failures = retryCount.map(dest => dest.ToAddresses[0]);
      throw `Could not complete service to email addresses ${failures.join(
        ',',
      )}}`;
    }
    await exports.sendWithRetry(applicationContext, {
      params,
      retryCount: retryCount + 1,
    });
  }
};
