const {
  createISODateString,
  formatDateString,
} = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');

/**
 * generateStandingPretrialNoticeInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateStandingPretrialNoticeInteractor = async ({
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

  const { docketNumberWithSuffix, irsPractitioners } = caseDetail;

  let respondentContactText = 'not available at this time';
  if (irsPractitioners && irsPractitioners.length) {
    const firstRespondent = irsPractitioners[0];
    respondentContactText = `${firstRespondent.name} (${firstRespondent.contact.phone})`;
  }

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const startTime = formatDateString(trialStartTimeIso, 'hh:mm A');
  const startDay = formatDateString(trialSession.startDate, 'dddd');
  const fullStartDate = formatDateString(
    trialSession.startDate,
    'dddd, MMMM D, YYYY',
  );

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingPretrialNotice({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        trialInfo: {
          ...trialSession,
          fullStartDate,
          respondentContactText,
          startDay,
          startTime,
        },
      },
    });

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
  });
};
