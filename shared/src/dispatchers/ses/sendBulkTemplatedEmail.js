/**
 * calls SES.sendBulkTemplatedEmail
 *
 * destinations = [
 *   {
 *      email: 'mayor@flavortown.com',
 *      templateData: { var1: 'value', var2: 'value' }
 *   }
 * ]
 *
 * @param {object} applicationContext application context
 * @param {Array} destinations array of destinations matching the format described above
 * @param {string} templateName name of the SES template
 * @returns {void}
 */
exports.sendBulkTemplatedEmail = async ({
  applicationContext,
  destinations,
  templateName,
}) => {
  const SES = applicationContext.getEmailClient();

  try {
    const params = {
      Destinations: destinations.map(destination => ({
        Destination: {
          ReplacementTemplateData: JSON.stringify(destination.templateData),
          ToAddresses: [destination.email],
        },
      })),
      Source: '',
      Template: templateName,
    };

    await SES.sendBulkTemplatedEmail(params).promise();
  } catch (err) {
    applicationContext.logger.error(err);
  }
};
