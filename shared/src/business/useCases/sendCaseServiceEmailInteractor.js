/**
 *
 * @param {object} applicationContext
 * @param {object} emailObject
 * @returns {Promise<*>}
 */
exports.sendCaseServiceEmailInteractor = async ({
  applicationContext,
  caseCaption,
  docketNumber,
  documentName,
  serviceDate,
  serviceTime,
  userEmails,
}) => {
  const destinations = userEmails.map(userEmail => ({
    email: userEmail.email,
    templateData: {
      caseCaption,
      docketNumber,
      documentName,
      name: userEmail.name,
      serviceDate,
      serviceTime,
    },
  }));

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    destinations,
    templateName: 'case_served',
  });
};

// lambda > this interactor > AC.getDispatchers().sendTemplatedBulkEmail({ params })
