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
  const SES = applicationContext.getEmailClient();

  try {
    const params = {
      DefaultTemplateData: JSON.stringify(defaultTemplateData),
      Destinations: destinations.map(destination => ({
        Destination: {
          ToAddresses: [destination.email],
        },
        ReplacementTemplateData: JSON.stringify(destination.templateData),
      })),
      Source: process.env.EMAIL_SOURCE,
      Template: templateName,
    };

    applicationContext.logger.info('Bulk Email Params', params);

    const response = await SES.sendBulkTemplatedEmail(params).promise();

    applicationContext.logger.info('Bulk Email Response', response);
  } catch (err) {
    applicationContext.logger.error(err);
    await applicationContext.notifyHoneybadger(err);
  }
};
