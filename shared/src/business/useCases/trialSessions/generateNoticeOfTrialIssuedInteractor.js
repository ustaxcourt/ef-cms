/**
 * generateNoticeOfTrialIssuedInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateNoticeOfTrialIssuedInteractor = async ({
  applicationContext,
  docketNumber,
  trialSessionId,
}) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const {
    address1,
    address2,
    city,
    courthouseName,
    judge,
    postalCode,
    startDate,
    startTime,
    state,
  } = trialSession;

  const { caseCaption, caseCaptionPostfix, docketNumberSuffix } = caseDetail;

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generateNoticeOfTrialIssuedTemplate({
      applicationContext,
      content: {
        caption: caseCaption,
        captionPostfix: caseCaptionPostfix,
        docketNumberWithSuffix: docketNumber + (docketNumberSuffix || ''),
        trialInfo: {
          address1,
          address2,
          city,
          courthouseName,
          judge,
          postalCode,
          startDate,
          startTime,
          state,
        },
      },
    });

  return await applicationContext.getUseCases().generatePdfFromHtmlInteractor({
    applicationContext,
    contentHtml,
  });
};
