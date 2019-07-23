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
 * @param {object} applicationContext application context
 * @param {object} defaultTemplateData default values correlated with templateData matching the format described above
 * @param {Array} destinations array of destinations matching the format described above
 * @param {string} templateName name of the SES template
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

    await SES.sendBulkTemplatedEmail(params).promise();
  } catch (err) {
    applicationContext.logger.error(err);
  }
};
