const {
  createISODateString,
  formatDateString,
  formatNow,
  FORMATS,
} = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');

/**
 * generateStandingPretrialOrderInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateStandingPretrialOrderInteractor = async (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
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

  const { startDate } = trialSession;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedStartDateWithDayOfWeek = formatDateString(
    startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const formattedStartDate = formatDateString(
    startDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const formattedJudgeName = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, 'hh:mm A');

  const formattedServedDate = formatNow(FORMATS.MMDDYY);

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingPretrialOrder({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
        trialInfo: {
          ...trialSession,
          formattedJudgeName,
          formattedServedDate,
          formattedStartDate,
          formattedStartDateWithDayOfWeek,
          formattedStartTime,
        },
      },
    });

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
  });
};
