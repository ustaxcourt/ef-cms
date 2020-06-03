const { formatNow } = require('../../utilities/DateHandler');

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

  const { caseCaption, docketNumberSuffix } = caseDetail;
  const footerDate = formatNow('MMDDYYYY');

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generateNoticeOfTrialIssuedTemplate({
      applicationContext,
      content: {
        caseCaption,
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
    footerHtml: `<h3 style="text-align:center; font-family: sans-serif; width: 100%;" class="text-bold served-date">Served ${footerDate}</h3>`,
  });
};
