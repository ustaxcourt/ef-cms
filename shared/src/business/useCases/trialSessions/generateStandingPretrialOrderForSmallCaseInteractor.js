const {
  createISODateString,
  formatDateString,
  formatNow,
  FORMATS,
} = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');

/**
 * generateStandingPretrialOrderForSmallCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateStandingPretrialOrderForSmallCaseInteractor = async (
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

  const { docketNumberWithSuffix } = caseDetail;

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, 'hh:mm A');

  const formattedServedDate = formatNow(FORMATS.MMDDYY);

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedJudgeName = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const formattedStartDate = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const formattedStartDateWithDayOfWeek = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingPretrialOrderForSmallCase({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
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
