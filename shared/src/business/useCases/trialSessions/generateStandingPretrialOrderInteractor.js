/**
 * generateStandingPretrialOrderInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateStandingPretrialOrderInteractor = async ({
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

  const { city, judge, startDate, startTime, state } = trialSession;

  const { caseCaption, docketNumberSuffix } = caseDetail;

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generateStandingPretrialOrderTemplate({
      applicationContext,
      content: {
        caseCaption,
        docketNumberWithSuffix: docketNumber + (docketNumberSuffix || ''),
        trialInfo: {
          city,
          judge,
          startDate,
          startTime,
          state,
        },
      },
    });

  return await applicationContext.getUseCases().generatePdfFromHtmlInteractor({
    applicationContext,
    contentHtml,
    headerHtml:
      '<div style="text-align:center;"><span class="pageNumber"></span></div>',
    overwriteHeader: true,
  });
};
