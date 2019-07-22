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
      DefaultTemplateData: JSON.stringify({
        caseCaption: 'undefined',
        docketNumber: 'undefined',
        documentName: 'undefined',
        name: 'undefined',
        serviceDate: 'undefined',
        serviceTime: 'undefined',
      }),
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
